# Needs Map

## Customer Routes

### `/dashboard`
- `app/(customer)/dashboard/page.tsx`
  - Data needed:
    - Dashboard summary metrics (active orders, pending quotations, delivered items, due payment)
    - Pending payment list
    - Recent quotation cards and activity entries
  - User actions:
    - "View All" quotation button
    - Quotation card action button
    - Support ticket button
- Shared customer components:
  - `components/customer/DashboardHeader.tsx`
    - Data: page title, search placeholder, notification count
    - Actions: search input, notifications button, "New Requirement" link
  - `components/common/GlobalStatCard.tsx`
    - Data: stat card values and theme props
  - `components/customer/ActivityItem.tsx`
    - Data: activity text, time, type indicator

### `/delivery-tracking`
- `app/(customer)/delivery-tracking/page.tsx`
  - Data needed:
    - Orders list and selected order details
    - Delivery timeline steps
  - User actions:
    - Select order from dropdown
    - View selected order delivery details

### `/invoices`
- `app/(customer)/invoices/page.tsx`
  - Data needed:
    - Invoice list with ID, order reference, date, amount, and status
    - Selected invoice detail for preview modal
  - User actions:
    - Open invoice preview modal
    - Close modal by click or close button
    - Action buttons for viewing/downloading invoice

### `/payments`
- `app/(customer)/payments/page.tsx`
  - Data needed:
    - Pending invoice list and selected invoice details
    - Payment submission form fields (payment method, transaction ID, notes)
  - User actions:
    - Select pending invoice by card click or dropdown
    - Enter transaction ID
    - Reset selection
    - Save draft and submit payment buttons
    - File upload area UI placeholder

### `/quotations`
- `app/(customer)/quotations/page.tsx`
  - Data needed:
    - Quotation list with IDs, references, dates, items, amount, and status
    - Selected quotation detail for modal display
  - User actions:
    - Open/close quotation detail modal
    - Accept/reject buttons for pending quotations (UI buttons)
    - Search input and status filter controls present in UI

### `/send-requirements`
- `app/(customer)/send-requirements/page.tsx`
  - Data needed:
    - Draft requirement line items with product, quantity, unit, delivery date, and notes
    - Live summary stats and status indicators
  - User actions:
    - Add new line item
    - Remove line item
    - Update item fields (product, quantity, delivery date, notes)
    - Dispatch requirement button

### `/my-orders`
- `app/(customer)/my-orders/page.tsx`
  - Data needed:
    - Customer order list with ID, quotation reference, date, amount, and status
  - User actions:
    - Search input and status filter dropdown visible
    - Order table display and status badges

### Customer navigation
- `components/customer/Sidebar.tsx`
  - Data needed:
    - Navigation item labels, icons, hrefs, and current path
  - Actions:
    - Route navigation links
    - Active item highlighting based on current path
- `components/common/GlobalSidebar.tsx`
  - Data needed:
    - Sidebar platform branding, nav items, settings link, and current path
  - Actions:
    - Render clickable navigation and settings links

## Supplier Routes

### `/supplier-dashboard`
- `app/(supplier)/supplier-dashboard/page.tsx`
  - Data needed:
    - Supplier dashboard stats and summary values
    - Recent requirement and recent order card placeholders
    - Pending payments table display
  - User actions:
    - Navigation link buttons to customer requirements, orders, and invoice submission
    - Dashboard cards and links act as navigation targets

### `/customer-requirements`
- `app/(supplier)/customer-requirements/page.tsx`
  - Data needed:
    - Customer requirement dataset with IDs, customer names, item details, quantity, delivery, docs, and status
    - Summary stat cards for request counts by status
  - User actions:
    - Search input to filter requirements
    - Status filter dropdown
    - Refresh button
    - View details and send quotation action buttons in requirement rows

### `/create-quotation`
- `app/(supplier)/create-quotation/page.tsx`
  - Data needed:
    - Draft quotation line items and computed subtotal, tax, grand total
    - Quotation metadata and form inputs for dates/terms/payment method
  - User actions:
    - Add line item
    - Remove line item
    - Enter item description, quantity, unit price
    - Choose dates and payment terms
    - Submit quotation and save draft buttons

### `/quotation-status`
- `app/(supplier)/quotation-status/page.tsx`
  - Data needed:
    - Submitted quotation dataset with IDs, requirement refs, customer, dates, total amount, and status
    - Summary stat cards for quotation statuses
  - User actions:
    - Search input and status filter dropdown
    - Refresh button
    - View details and download buttons for each quotation row

### `/orders`
- `app/(supplier)/orders/page.tsx`
  - Data needed:
    - Supplier order dataset with IDs, customer, items, amounts, dates, and status
    - Summary stats for order status counts
  - User actions:
    - Search input and status filter dropdown
    - Refresh button
    - View details and update status action buttons per order row

### `/delivery&dispatch`
- `app/(supplier)/delivery&dispatch/page.tsx`
  - Data needed:
    - Selected order reference
    - Dispatch information fields and placeholder progress state
  - User actions:
    - Select order from dropdown
    - Enter vehicle number and driver name
    - Add delivery notes
    - Finalize dispatch button

### `/invoice-submission`
- `app/(supplier)/invoice-submission/page.tsx`
  - Data needed:
    - Selected order for invoice submission
    - Selected invoice PDF file reference
    - Invoice totals and descriptive notes
  - User actions:
    - Select purchase order
    - Choose due date
    - Upload PDF file
    - Clear selected file
    - Reset form
    - Finalize and submit invoice

### `/payment`
- `app/(supplier)/payment/page.tsx`
  - Data needed:
    - Payment ledger dataset (transactions)
    - Summary stat cards for received, settlement, transactions, and unsuccessful counts
  - User actions:
    - Search input and status filter dropdown
    - Refresh button
    - Transaction table display with action UI

### Supplier navigation
- `components/supplier/Sidebar.tsx`
  - Data needed:
    - Navigation items and current path
  - Actions:
    - Route navigation links
    - Active path styling
- `components/ui/GlobalSidebar.tsx`
  - Data needed:
    - Platform branding, nav item data, settings link, and current path
  - Actions:
    - Render navigation and settings link clicks
- `components/supplier/Header.tsx`
  - Data needed:
    - Page title, search field placeholder, notification count, user profile display
  - Actions:
    - Search input
    - New quotation link
    - Notification button

## Shared UI Components
- `components/common/Panel.tsx`
  - Data: section titles, icons, badges, dark mode styling
  - Actions: renders contained UI and panel layout for interactive pages

- `components/common/GlobalSidebar.tsx` and `components/ui/GlobalSidebar.tsx`
  - Data: navigation definitions and active-path styling
  - Actions: navigation links and settings link click targets
