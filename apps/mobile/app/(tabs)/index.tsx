import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

type Child = {
  type: string;
  text: string;
};

type Block = {
  type: string;
  children: Child[];
};

type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

type Article = {
  id: number;
  title: string;
  content: Block[];
  category: Category;
};

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/articles?populate=category`);
        const json = await res.json();
        setArticles(json.data);
      } catch (error) {
        console.error('Fel vid hämtning:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const renderArticle = ({ item }: { item: Article }) => (
    <View style={styles.articleCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category?.name}</Text>
      {item.content.map((block, i) => (
        <Text key={i} style={styles.content}>
          {block.children.map(child => child.text).join(' ')}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Knowledge Base</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingVertical: 10,
  },
  articleCard: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5
  },
  content: {
    fontSize: 14,
    color: '#555'
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  }
});

