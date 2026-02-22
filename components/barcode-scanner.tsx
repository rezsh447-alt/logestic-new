import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

interface BarcodeScannerProps {
  onBarcodeScanned?: (barcode: string) => void;
  autoNavigate?: boolean;
}

/**
 * Manual barcode entry component for package identification
 * (expo-barcode-scanner removed due to SDK incompatibility)
 */
export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
  autoNavigate = false,
}) => {
  const router = useRouter();
  const [barcode, setBarcode] = useState('');

  const handleSubmit = () => {
    if (!barcode.trim()) {
      Alert.alert('خطا', 'لطفاً کد بارکد را وارد کنید');
      return;
    }

    if (onBarcodeScanned) {
      onBarcodeScanned(barcode.trim());
    }

    if (autoNavigate) {
      router.push({
        pathname: '/package-details',
        params: { trackingNumber: barcode.trim() },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>ورود کد بارکد</Text>
        <Text style={styles.subtitle}>کد بارکد یا شماره مرسوله را وارد کنید</Text>
        
        <TextInput
          style={styles.input}
          value={barcode}
          onChangeText={setBarcode}
          placeholder="کد بارکد..."
          placeholderTextColor="#999"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>تأیید</Text>
        </Pressable>
      </View>

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>بستن</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
