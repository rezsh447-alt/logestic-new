# Package Management System

This document describes the package management features added to the Logestic app, ported from the Flutter implementation.

## Features

### 1. Package Management
- **Add Packages**: Add new packages with tracking number and address
- **List Packages**: View all packages with status indicators
- **Search Packages**: Search by tracking number or address
- **Filter Packages**: Filter by status (pending, delivered, all)
- **Delete Packages**: Remove packages from the system

### 2. Barcode/QR Code Scanning
- **Scan Packages**: Use device camera to scan barcode/QR codes
- **Quick Lookup**: Instantly identify packages and view their details
- **Status Display**: Show package status and delivery order after scanning

### 3. Package Status Management
- **Toggle Status**: Change package status between "pending" and "delivered"
- **Status Indicators**: Visual badges showing current status
- **Status Filtering**: Filter packages by their status

### 4. Package Details
- **Comprehensive View**: Display all package information
- **Location Mapping**: Show coordinates and open in maps app
- **Timestamps**: Track creation and last update times
- **Delivery Order**: Display assigned delivery order number

### 5. Local Storage
- **AsyncStorage**: Uses React Native AsyncStorage for persistent local storage
- **Automatic Sync**: Data persists across app sessions
- **Efficient Queries**: Fast search and filter operations

### 6. Route Optimization
- **Nearest Neighbor Algorithm**: Optimizes delivery route based on current location
- **Distance Calculation**: Uses Haversine formula for accurate distance calculation
- **Delivery Order**: Automatically assigns delivery sequence
- **Statistics**: Shows total distance and estimated delivery time
- **Clustering**: Optional package clustering by proximity

### 7. Package Counter/Statistics
- **Total Packages**: Display total number of packages
- **Delivered Count**: Show number of delivered packages
- **Pending Count**: Show number of pending packages
- **Delivery Percentage**: Visual progress bar showing delivery progress

## Architecture

### Directory Structure

```
lib/
├── types/
│   └── package.ts              # Type definitions
├── storage/
│   └── package-storage.ts      # AsyncStorage wrapper
└── services/
    ├── location-service.ts     # Location and geocoding
    └── route-optimization.ts   # Route optimization logic

components/
├── barcode-scanner.tsx         # Barcode scanner component
└── package-stats.tsx           # Statistics display component

app/
├── (tabs)/
│   └── packages.tsx            # Main package list screen
├── add-package.tsx             # Add new package screen
├── package-details.tsx         # Package details screen
└── route-optimization.tsx      # Route optimization screen
```

### Key Services

#### PackageStorage
Handles all local storage operations:
- `getAllPackages()`: Get all packages
- `getPackage(trackingNumber)`: Get specific package
- `savePackage(pkg)`: Save or update package
- `deletePackage(trackingNumber)`: Delete package
- `updatePackageStatus(trackingNumber, status)`: Update status
- `getPackageStats()`: Get statistics
- `searchPackages(query)`: Search packages
- `filterPackagesByStatus(status)`: Filter by status
- `updatePackagesOrder(updates)`: Update delivery order

#### LocationService
Handles location operations:
- `getCurrentLocation()`: Get device location
- `getLocationFromAddress(address)`: Geocode address to coordinates
- `getAddressFromCoordinates(lat, lng)`: Reverse geocode
- `calculateDistance(lat1, lng1, lat2, lng2)`: Calculate distance
- `normalizeAddress(address)`: Normalize address string

#### RouteOptimizationService
Handles route optimization:
- `optimizeRoute(packages, currentLat, currentLng)`: Optimize delivery route
- `calculateTotalDistance(startLat, startLng, packages)`: Calculate total distance
- `getEstimatedDeliveryTime(distance, speed)`: Estimate delivery time
- `clusterPackages(packages, radius)`: Cluster nearby packages

## Data Models

### Package
```typescript
interface Package {
  trackingNumber: string;
  address: string;
  lat?: number;
  lng?: number;
  status: 'pending' | 'delivered';
  order?: number;
  createdAt: number;
  updatedAt: number;
}
```

### PackageStats
```typescript
interface PackageStats {
  total: number;
  delivered: number;
  pending: number;
}
```

### RouteOptimizationResult
```typescript
interface RouteOptimizationResult {
  trackingNumber: string;
  order: number;
  lat: number;
  lng: number;
}
```

## Usage

### Adding a Package
1. Navigate to the Packages tab
2. Tap the "+" button to add a new package
3. Enter tracking number and address
4. Tap "Add" - address will be geocoded automatically

### Scanning a Package
1. Tap the barcode scanner button (camera icon)
2. Point camera at barcode/QR code
3. System will automatically identify the package
4. View package details or mark as delivered

### Optimizing Route
1. Navigate to Route Optimization screen
2. Tap "Optimize Route" button
3. System will calculate optimal delivery sequence
4. View statistics and delivery order

### Managing Packages
- **Search**: Use search bar to find packages
- **Filter**: Use filter buttons to show pending/delivered packages
- **Update Status**: Tap package to view details and change status
- **Delete**: Swipe or use delete button to remove package

## Configuration

### Environment Variables
Add to your `.env` file:
```
EXPO_PUBLIC_NESHAN_API_KEY=your_api_key_here
```

If not configured, the app will use mock coordinates for development.

### Dependencies
- `@react-native-async-storage/async-storage`: Local storage
- `expo-barcode-scanner`: Barcode scanning
- `expo-location`: Location services
- `react-native-maps`: Map display (optional)

## Performance Considerations

1. **Storage**: AsyncStorage is suitable for up to 10,000 packages
2. **Route Optimization**: Nearest neighbor algorithm is O(n²), suitable for < 1000 packages
3. **Search**: Linear search is acceptable for typical use cases
4. **Caching**: Consider caching location lookups to reduce API calls

## Future Enhancements

1. **Backend Integration**: Sync with backend server
2. **Real-time Updates**: WebSocket for live package updates
3. **Advanced Routing**: TSP (Traveling Salesman Problem) solver
4. **Offline Mode**: Work without internet connection
5. **Analytics**: Track delivery performance metrics
6. **Notifications**: Push notifications for package updates
7. **Photo Proof**: Capture delivery proof photos
8. **Customer Communication**: Send delivery notifications

## Troubleshooting

### Barcode Scanner Not Working
- Check camera permissions in app settings
- Ensure good lighting for scanning
- Try different barcode types

### Location Not Found
- Check location permissions
- Verify address format
- Check Neshan API key configuration

### Route Optimization Slow
- Reduce number of packages
- Check device performance
- Verify location data for all packages

## Testing

### Test Data
Add test packages using the Add Package screen:
```
Tracking: TEST001, Address: Tehran, Iran
Tracking: TEST002, Address: Isfahan, Iran
Tracking: TEST003, Address: Shiraz, Iran
```

### Manual Testing
1. Add 5-10 test packages
2. Scan a package using barcode scanner
3. Change package status
4. Optimize route
5. Verify statistics update
