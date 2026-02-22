# Forward Driver App - Design Document

## Brand & Colors

**App Name:** Forward  
**Brand Colors:**
- Primary: `#0066CC` (Professional Blue - trust, logistics)
- Secondary: `#FF6B35` (Alert Orange - urgency, visibility)
- Success: `#22C55E` (Green - delivery complete)
- Warning: `#F59E0B` (Amber - pending actions)
- Error: `#EF4444` (Red - issues)
- Background: `#FFFFFF` (Light), `#0F172A` (Dark)
- Surface: `#F8FAFC` (Light), `#1E293B` (Dark)
- Text: `#0F172A` (Light), `#F1F5F9` (Dark)

## Screen List & User Flows

### 1. **Login & Authentication**
- Phone number login with OTP verification
- Biometric authentication (Face ID / Fingerprint)
- Session persistence

### 2. **Home / Dashboard**
- Active deliveries count
- Earnings today
- Quick stats (km driven, deliveries completed)
- Current delivery card (if active)
- Action buttons: Start Shift, View Orders

### 3. **Active Orders / Deliveries**
- List of assigned orders (pending, in-progress, completed)
- Order card shows: pickup location, delivery location, customer name, payment status
- Swipe to accept/reject orders
- Tap to view order details

### 4. **Order Details**
- Full order information (sender, receiver, items, weight)
- Pickup & delivery addresses with map preview
- Customer contact info
- Special instructions
- Action buttons: Navigate, Call Customer, Mark as Picked Up, Mark as Delivered

### 5. **Live Tracking & Navigation**
- Real-time GPS tracking on map
- Route optimization
- ETA calculation
- Navigation integration (Google Maps / Apple Maps)
- Pause/Resume delivery tracking
- Geofence alerts

### 6. **Delivery Proof**
- Photo capture for pickup/delivery
- Customer signature (if required)
- Notes/comments
- Confirm delivery button

### 7. **Earnings & History**
- Daily earnings summary
- Weekly/monthly breakdown
- Completed deliveries history
- Filter by date range
- Export earnings report

### 8. **Driver Profile**
- Personal info (name, phone, email)
- Vehicle info (plate number, type, capacity)
- Documents (license, insurance, registration)
- Rating & reviews from customers
- Bank account for payouts
- Edit profile

### 9. **Support & Chat**
- In-app chat with support team
- FAQ section
- Report issues
- Ticket history

### 10. **Settings**
- Notification preferences
- Language selection (Persian/English)
- Dark mode toggle
- Logout

## Primary User Flows

### Flow 1: Start Shift & Accept Order
1. Driver opens app → Home screen
2. Taps "Start Shift" button
3. System shows available orders
4. Driver reviews order details
5. Taps "Accept Order"
6. Navigation screen opens automatically

### Flow 2: Complete Delivery
1. Driver navigates to delivery location
2. Arrives at location (geofence trigger)
3. Taps "Arrived" button
4. Takes photo of delivery location
5. Gets customer signature/confirmation
6. Taps "Mark as Delivered"
7. System confirms, shows next order or end shift

### Flow 3: View Earnings
1. Driver taps "Earnings" tab
2. Sees daily/weekly summary
3. Can filter by date
4. Taps on specific day to see order breakdown
5. Can view bank account status

## Layout Specifications

**Portrait Orientation (9:16)** - All screens optimized for one-handed usage

### Typical Screen Layout:
```
┌─────────────────────┐
│  Status Bar (Safe)  │  ← Notch/Safe area
├─────────────────────┤
│                     │
│   Header/Title      │  ← 56px
├─────────────────────┤
│                     │
│   Main Content      │  ← Scrollable
│   (Cards, Lists)    │
│                     │
├─────────────────────┤
│   Tab Bar (Safe)    │  ← 56px + bottom safe
└─────────────────────┘
```

### Spacing & Padding:
- Screen padding: 16px
- Card padding: 12px
- Gap between elements: 8px or 12px
- Button height: 48px (tap target minimum)

## Key Design Decisions

1. **Bottom Tab Navigation:** Home, Orders, Tracking, Earnings, Profile
2. **Card-based UI:** Order cards, delivery cards for easy scanning
3. **Action-focused:** Large, accessible buttons for primary actions
4. **Real-time Updates:** Live tracking, order status updates
5. **Offline Support:** Cache orders, sync when connection restored
6. **Accessibility:** High contrast, readable fonts (16px minimum)
7. **Haptic Feedback:** Confirm actions (accept order, delivery complete)
8. **Dark Mode:** Full support for eye comfort during night shifts
