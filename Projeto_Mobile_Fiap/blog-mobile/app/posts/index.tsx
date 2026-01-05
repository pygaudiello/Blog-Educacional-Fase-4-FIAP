import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

import { styles } from '../../src/theme/styles';

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

export default function PostsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  // No topo do arquivo, adicione:


// Depois das imports, adicione:
const API_BASE = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  ios: 'http://localhost:4000/api',
  default: 'http://192.168.1.40:4000/api',
})!;

// E na função fetchPosts:
const fetchPosts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/posts`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(res.data);
    setFilteredPosts(res.data);
  } catch (error) {
    console.error(error);
  }
};

  // Recarrega posts toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  // Filtra posts quando o usuário digita na barra de busca
  useEffect(() => {
    setFilteredPosts(
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.author.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, posts]);

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="Buscar posts..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {/* Controles extras só para professores */}
        {user?.role === 'teacher' && (
          <View style={styles.teacherControls}>
            <Pressable
              style={styles.teacherButton}
              onPress={() => router.push('/posts/create')}
            >
              <Text style={styles.teacherButtonText}>Criar Post</Text>
            </Pressable>

            <Pressable
              style={styles.teacherButton}
              onPress={() => router.push('/edit-post/1')} // exemplo: editar post 1
            >
              <Text style={styles.teacherButtonText}>Editar Posts</Text>
            </Pressable>

            <Pressable
            style={styles.teacherButton}
            onPress={() => router.push('/professores' as any)}
            >
            <Text style={styles.teacherButtonText}>Gerenciamento de Professores</Text>
            </Pressable>

            <Pressable
            style={styles.teacherButton}
            onPress={() => router.push('/alunos' as any)}
            >
            <Text style={styles.teacherButtonText}>Gerenciamento de Alunos</Text>
            </Pressable>

          </View>
        )}
      </View>

      {/* Lista de posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/posts/${item.id}`)}>
            <View style={styles.postCard}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postAuthor}>{item.author}</Text>
              <Text numberOfLines={2} style={styles.postDescription}>
                {item.content}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
