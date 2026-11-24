import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Share } from 'react-native';
import { initialMemes } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

export const MemesTab = () => {
  const [memes, setMemes] = useState(initialMemes);
  const [apiMemes, setApiMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch wholesome memes from external public API
  function fetchLiveMemes() {
    setLoading(true);
    setError('');

    fetch('https://meme-api.com/gimme/wholesomememes/4')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch memes from the API.');
        }
        return res.json();
      })
      .then((data) => {
        setApiMemes(data.memes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchLiveMemes();
  }, []);

  function handleReaction(id) {
    const updated = memes.map((m) =>
      m.id === id ? { ...m, reactions: m.reactions + 1 } : m
    );
    setMemes(updated);
  }

  function handleShare(text) {
    Share.share({ message: text + '\n\n— MindBloom Chill Space 🌴' }).catch(() => {});
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionHeading}>😂 Memes & Comic Relief</Text>
          <Text style={styles.sectionSubtext}>Laughter is somatic medicine</Text>
        </View>
        <TouchableOpacity style={styles.smallBtn} onPress={fetchLiveMemes}>
          <Text style={styles.smallBtnText}>🔄 Refresh Feed</Text>
        </TouchableOpacity>
      </View>

      {/* Local Kenyan Memes */}
      {memes.map((meme) => (
        <View key={meme.id} style={styles.card}>
          <Text style={[styles.tagText, { marginBottom: 8 }]}>
            {meme.badgeEmoji} {meme.badge}
          </Text>

          {meme.hasSubBox && (
            <View style={styles.memeSubBox}>
              <Text style={{ fontSize: 24 }}>{meme.subBoxEmoji}</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 4 }}>
                {meme.subBoxTitle}
              </Text>
            </View>
          )}

          <Text style={styles.bodyText}>{meme.content}</Text>

          <View style={styles.cardBottom}>
            <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction(meme.id)}>
              <Text style={styles.actionText}>
                {meme.reactionEmoji} {meme.reactions}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleShare(meme.content)}>
              <Text style={styles.actionText}>↗️ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* External API Wholesome Memes */}
      <View style={[styles.sectionHeader, { marginTop: 10 }]}>
        <View>
          <Text style={styles.sectionHeading}>🌍 More Wholesome Memes</Text>
          <Text style={styles.sectionSubtext}>Live feed from Meme API</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.infoBox}>
          <ActivityIndicator color="#42213D" />
          <Text style={[styles.metaText, { marginTop: 8 }]}>Loading fresh wholesome memes...</Text>
        </View>
      )}

      {error !== '' && (
        <View style={[styles.infoBox, styles.errorBox]}>
          <Text style={{ color: '#BA1A1A', marginBottom: 10 }}>Error: {error}</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={fetchLiveMemes}>
            <Text style={styles.smallBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading &&
        error === '' &&
        apiMemes.map((item) => (
          <View key={item.postLink} style={styles.card}>
            <Text style={[styles.tagText, { marginBottom: 8 }]}>✨ r/{item.subreddit}</Text>
            <Image source={{ uri: item.url }} style={styles.memeImage} resizeMode="cover" />
            <Text style={styles.bodyText}>{item.title}</Text>
            <View style={styles.cardBottom}>
              <View style={styles.reactionPill}>
                <Text style={styles.actionText}>⬆️ {item.ups}</Text>
              </View>
              <TouchableOpacity onPress={() => handleShare(`${item.title} ${item.postLink}`)}>
                <Text style={styles.actionText}>↗️ Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </View>
  );
};