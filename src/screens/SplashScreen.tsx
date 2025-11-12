import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/colors';
import { WELCOME_IMAGE } from '../utils/constants';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Home'), 2500);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.splashContainer}>
      <Image
        source={{ uri: WELCOME_IMAGE }}
        style={styles.welcomeImage}
        blurRadius={1}
      />
      <View style={styles.splashOverlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Christoffel</Text>
          <Text style={styles.subtitle}>Private Chef — Culinary Excellence</Text>
        </View>

        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🍽️</Text>
            <Text style={styles.featureText}>Fine Dining</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👨‍🍳</Text>
            <Text style={styles.featureText}>Expert Chef</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>5 Star Quality</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.enterBtn} onPress={() => navigation.replace('Home')}>
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Explore Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  welcomeImage: {
    width: '100%' as const,
    height: '100%' as const,
    position: 'absolute' as const,
  },
  splashOverlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 139, 87, 0.85)',
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center' as const,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    textAlign: 'center' as const,
  },
  featureGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginVertical: 40,
  },
  featureItem: {
    alignItems: 'center' as const,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 12,
    textAlign: 'center' as const,
  },
  enterBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default SplashScreen;
