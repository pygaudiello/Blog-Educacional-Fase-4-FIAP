import { api } from '@/src/api/api';
import { colors } from '@/src/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/theme/styles';

type Comment = {
  id: number;
  content: string;
  author: string;
  createdAt?: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  Comments?: Comment[];
};

export default function PostDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleteCommentModal, setDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const res = await api.get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Post recebido:', res.data);
      setPost(res.data);
      setError('');
    } catch (err: any) {
      console.error('Erro ao carregar post:', err);
      setError('Não foi possível carregar o post');
      Alert.alert('Erro', 'Não foi possível carregar o post');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      setSubmittingComment(true);
      
      await api.post(
        `/api/posts/${id}/comments`,
        {
          author: user.username || 'Anônimo',
          content: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchPost();
      setNewComment('');
      Alert.alert('Sucesso', 'Comentário adicionado!');
    } catch (err: any) {
      console.error('Erro ao adicionar comentário:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteCommentModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      // TENTAR DIFERENTES ROTAS BASEADO NA SUA API
      const routesToTry = [
        `/api/comments/${commentToDelete}`,
        `/api/posts/${id}/comments/${commentToDelete}`
      ];
      
      let success = false;
      let lastError;
      
      for (const url of routesToTry) {
        try {
          await api.delete(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Comentário excluído com sucesso usando rota:', url);
          success = true;
          break;
        } catch (err: any) {
          lastError = err;
          console.log(`Rota falhou (${url}):`, err.response?.status);
          // Continua para próxima rota
        }
      }
      
      if (success) {
        await fetchPost();
        setDeleteCommentModal(false);
        setCommentToDelete(null);
        Alert.alert('Sucesso', 'Comentário excluído!');
      } else {
        throw lastError || new Error('Todas as rotas falharam');
      }
    } catch (err: any) {
      console.error('Erro ao excluir comentário:', err);
      Alert.alert('Erro', 'Não foi possível excluir o comentário. Verifique a rota da API.');
    }
  };

  const handleEditPost = () => {
    if (!post || user?.role !== 'teacher') return;
    router.push(`/edit-post/${post.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} - ${date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={styles.postButton.backgroundColor} />
        <Text style={{ marginTop: 16, fontSize: 16, color: colors.text }}>
          Carregando post...
        </Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[styles.cardContainer, { alignItems: 'center', padding: 32 }]}>
          <Text style={[styles.errorText, { marginBottom: 24, textAlign: 'center' }]}>
            {error || 'Post não encontrado'}
          </Text>
          <Pressable
            style={[styles.postButton, { width: '100%', maxWidth: 200 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.postButtonText}>Voltar para lista</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const comments = post.Comments || [];
  const isTeacher = user?.role === 'teacher';
  
  // APENAS o autor do comentário ou professor podem excluir
  const canDeleteComment = (commentAuthor: string) => {
    return user?.username === commentAuthor || isTeacher;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.screen}>
        {/* Header com navegação */}
        <View style={[styles.appBar, { marginBottom: 16 }]}>
          <Pressable onPress={() => router.back()} style={styles.teacherButton}>
            <Text style={styles.teacherButtonText}>Voltar</Text>
          </Pressable>
          
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.postFormTitle, { marginBottom: 0, fontSize: 18 }]}>
              Detalhes do Post
            </Text>
          </View>
          
          {isTeacher && (
            <Pressable
              onPress={handleEditPost}
              style={[styles.teacherButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.teacherButtonText}>Editar</Text>
            </Pressable>
          )}
        </View>

        {/* Conteúdo Principal */}
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        >
          {/* Card do Post */}
          <View style={[styles.postFormContainer, { width: '100%', marginBottom: 28 }]}>
            <Text style={[styles.postTitle, { fontSize: 26, marginBottom: 12 }]}>
              {post.title}
            </Text>
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0'
            }}>
              <Text style={[styles.postAuthor, { fontSize: 14 }]}>
                Por: <Text style={{ fontWeight: 'bold' }}>{post.author}</Text>
              </Text>
              <Text style={[styles.postAuthor, { fontSize: 14 }]}>
                {formatDate(post.createdAt)}
              </Text>
            </View>

            <View style={{ 
              backgroundColor: '#e8f2fdff',
              padding: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e8e8e8'
            }}>
              <Text style={[styles.postDescription, { 
                fontSize: 16, 
                lineHeight: 24,
                color: colors.text
              }]}>
                {post.content}
              </Text>
            </View>
          </View>

          {/* Seção de Comentários */}
          <View style={{ width: '100%' }}>
            {/* Cabeçalho dos Comentários */}
            <View style={{ 
              marginBottom: 20,
              paddingBottom: 12,
              borderBottomWidth: 2,
              borderBottomColor: colors.primary
            }}>
              <Text style={[styles.postFormTitle, { 
                textAlign: 'left', 
                marginBottom: 0,
                fontSize: 22
              }]}>
                Comentários ({comments.length})
              </Text>
            </View>

            {/* Formulário para Novo Comentário */}
            <View style={[styles.postFormContainer, { 
              width: '100%',
              marginBottom: 28,
              borderWidth: 1,
              borderColor: '#e8e8e8',
              backgroundColor: '#f8f9ff'
            }]}>
              <Text style={[styles.postAuthor, { 
                marginBottom: 16,
                fontWeight: '600',
                fontSize: 16,
                color: colors.primary
              }]}>
                Adicionar Comentário
              </Text>
              
              <TextInput
                placeholder="Digite seu comentário aqui..."
                placeholderTextColor={colors.textSecondary}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                style={[styles.postTextarea, { 
                  minHeight: 120,
                  marginBottom: 20,
                  backgroundColor: '#e8f2fdff'
                }]}
              />
              
              <Pressable
                onPress={handleAddComment}
                disabled={!newComment.trim() || submittingComment}
                style={[
                  styles.postButton,
                  { 
                    opacity: (!newComment.trim() || submittingComment) ? 0.6 : 1
                  }
                ]}
              >
                <Text style={styles.postButtonText}>
                  {submittingComment ? 'Enviando...' : 'Publicar Comentário'}
                </Text>
              </Pressable>
            </View>

            {/* Lista de Comentários Existentes */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View 
                  key={comment.id} 
                  style={[styles.postCard2, { 
                    width: '100%',
                    marginBottom: 16,
                    padding: 20,
                    position: 'relative'
                  }]}
                >
                  {/* Cabeçalho do Comentário com ações */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 14
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontWeight: 'bold', 
                        color: colors.primary,
                        fontSize: 16,
                        marginBottom: 4
                      }}>
                        {comment.author}
                      </Text>
                      
                      {comment.createdAt && (
                        <Text style={[styles.postAuthor, { fontSize: 12 }]}>
                          {formatDateTime(comment.createdAt)}
                        </Text>
                      )}
                    </View>
                    
                    {/* Botão de excluir - para autor OU professor */}
                    {canDeleteComment(comment.author) && (
                      <Pressable
                        onPress={() => handleDeleteComment(comment.id)}
                        style={{ padding: 6 }}
                      >
                        <Text style={[styles.errorText, { fontSize: 13 }]}>Excluir</Text>
                      </Pressable>
                    )}
                  </View>
                  
                  {/* Conteúdo do Comentário */}
                  <Text style={[styles.postDescription, { 
                    fontSize: 15, 
                    lineHeight: 22,
                    color: colors.text,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0'
                  }]}>
                    {comment.content}
                  </Text>
                </View>
              ))
            ) : (
              <View style={[styles.postCard2, { 
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 48
              }]}>
                <Text style={[styles.postAuthor, { 
                  textAlign: 'center',
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: colors.textSecondary
                }]}>
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </Text>
              </View>
            )}
          </View>
          
          {/* Espaço extra no final para rolagem */}
          <View style={{ height: 60 }} />
        </ScrollView>
      </View>

      {/* Modal para Confirmar Exclusão de Comentário */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteCommentModal}
        onRequestClose={() => setDeleteCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cardContainer}>
            <Text style={[styles.postFormTitle, { marginBottom: 16 }]}>
              Confirmar Exclusão
            </Text>
            
            <Text style={[styles.postDescription, { 
              textAlign: 'center',
              marginBottom: 28,
              fontSize: 16
            }]}>
              Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => setDeleteCommentModal(false)}
                style={[styles.teacherButton, { 
                  flex: 1,
                  backgroundColor: colors.textThree
                }]}
              >
                <Text style={styles.teacherButtonText}>Cancelar</Text>
              </Pressable>
              
              <Pressable
                onPress={confirmDeleteComment}
                style={[
                  styles.teacherButton,
                  { 
                    flex: 1,
                    backgroundColor: colors.error
                  }
                ]}
              >
                <Text style={styles.teacherButtonText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}