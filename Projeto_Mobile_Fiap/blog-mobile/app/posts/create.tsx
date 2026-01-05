import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/theme/styles';

export default function CreatePost() {
  const { user, token } = useAuth(); // <-- pegando token
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = async () => {
    if (!title || !content) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }

    if (!token) {
      return Alert.alert('Erro', 'Usuário não autenticado');
    }

    try {
      await axios.post(
        'http://localhost:4000/api/posts',
        {
          title,
          content,
          author: user?.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- enviando token
          },
        }
      );

      Alert.alert('Sucesso', 'Post criado com sucesso!');
      router.back(); // volta para a lista
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível criar o post'
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#d5e5f6ff' }}
      contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}
    >
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Criar Novo Post</Text>
        <Text style={styles.subtitle}>Preencha os campos abaixo para publicar</Text>

        <TextInput
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Conteúdo"
          value={content}
          onChangeText={setContent}
          multiline
          style={[styles.input, { height: 180, textAlignVertical: 'top' }]}
        />

        <Pressable style={[styles.teacherButton, { marginTop: 12 }]} onPress={handleCreate}>
          <Text style={styles.teacherButtonText}>Criar Post</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
