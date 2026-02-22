import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { BarcodeScanningResult, useBarcodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import { PackageStorage } from '@/lib/storage/package-storage';

interface BarcodeScannerProps {
  onBarcodeScanned?: (barcode: string) => void;
  autoNavigate?: boolean;
}

/**
 * Barcode/QR code scanner component for package identification
 */
export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
  autoNavigate = false,
}) => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { scanned, data } = useBarcodeScanner({
    settings: {
      isHighDensityTracking: true,
      barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'],
    },
  });

  /**
   * Request camera permissions
   */
  useEffect(() => {
    (async () => {
      const { status } = await useBarcodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /**
   * Handle barcode scan
   */
  useEffect(() => {
    if (scanned && data && !isProcessing) {
      handleBarcodeScan(data);
    }
  }, [scanned, data]);

  /**
   * Process scanned barcode
   */
  const handleBarcodeScan = async (barcodeData: BarcodeScanningResult) => {
    try {
      setIsProcessing(true);
      const barcode = barcodeData.value || '';

      if (!barcode) {
        Alert.alert('خطا', 'کد بارکد خالی است');
        setIsProcessing(false);
        return;
      }

      setScannedCode(barcode);

      // Check if package exists
      const pkg = await PackageStorage.getPackage(barcode);

      if (pkg) {
        // Call callback if provided
        if (onBarcodeScanned) {
          onBarcodeScanned(barcode);
        }

        // Show package info
        const orderText = pkg.order ? `#${pkg.order} - ` : '';
        Alert.alert(
          'بسته پیدا شد',
          `${orderText}${barcode}\nآدرس: ${pkg.address}\nوضعیت: ${pkg.status === 'delivered' ? 'تحویل شده' : 'در انتظار'}`,
          [
            {
              text: 'بستن',
              onPress: () => {
                setScannedCode(null);
                setIsProcessing(false);
              },
            },
            {
              text: 'جزئیات',
              onPress: () => {
                if (autoNavigate) {
                  router.push({
                    pathname: '/package-details',
                    params: { trackingNumber: barcode },
                  });
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'بسته‌ای پیدا نشد',
          `بسته‌ای با کد "${barcode}" در سیستم ثبت نشده است`,
          [
            {
              text: 'بستن',
              onPress: () => {
                setScannedCode(null);
                setIsProcessing(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('خطا', 'خطایی در پردازش بارکد رخ داد');
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>درخواست دسترسی دوربین...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>دسترسی به دوربین رد شد</Text>
        <Text style={styles.subText}>برای استفاده از اسکنر، باید دسترسی دوربین را فعال کنید</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        {/* Scanner would be rendered here by expo-barcode-scanner */}
        <View style={styles.scannerPlaceholder}>
          <Text style={styles.scannerText}>دوربین فعال است</Text>
          {scannedCode && (
            <Text style={styles.scannedText}>آخرین کد: {scannedCode}</Text>
          )}
        </View>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          دوربین را به سمت بارکد یا کد QR بسته‌ها نشان دهید
        </Text>
      </View>

      <Pressable
        style={styles.closeButton}
        onPress={() => router.back()}
      >
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
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerPlaceholder: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scannerText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  scannedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 10,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  instructionsText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
