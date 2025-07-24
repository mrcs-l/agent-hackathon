Claude Prompt: AidBridge Connect Command Center Frontend - Mock Interactive Features Implementation

Objective:
Implement MOCK interactive features that enable the complete "Typhoon Genesis" response scenario. Focus on creating a demo-ready application where a logistics coordinator can experience the full workflow from disaster detection through automated matching to shipment re-routing decisions.

Current Implementation Analysis:
The existing codebase provides a solid foundation with React TypeScript, real map integration, and basic detail views. The following MOCK features need to be implemented to enable the complete scenario workflow.

CRITICAL MOCK FEATURES TO IMPLEMENT:

1. **Enhanced Interactive Map Pop-ups** (src/components/WorldMap.tsx):
   - Disaster marker clicks should show pop-up with "View Needs Assessment" and "View Active Shipments" buttons
   - These buttons should trigger navigation to respective detail views with mock data
   - Shipment lines should be dynamic with color changes based on status (green=on_time, yellow=delayed, red=critical)
   - Mock real-time updates: shipment lines should change color when status updates occur

2. **Disaster Needs Assessment View Enhancements** (new: src/components/DisasterNeedsView.tsx):
   - Summary panel showing "Urgency Level" and "Top 5 Unmet Needs"
   - Enhanced needs table with "Quantity Matched (Agentforce)" column that shows mock real-time updates
   - "Match Remaining Needs" button that simulates auto-matching when clicked
   - Mock bar charts showing match rates vs. gaps
   - Real-time counter animations showing quantities being matched

3. **Intelligent Alert System with Actions** (enhanced: src/components/AlertsPanel.tsx):
   - Clickable alerts that navigate directly to relevant detail views
   - Mock "Human-in-the-Loop Agent" recommendations pop-up with multiple action buttons:
     - "Approve Recommended Action"
     - "View Alternative Route on Map" 
     - "Contact Carrier"
     - "Report Issue"
   - Alert status tracking (Active → Awaiting Resolution → Resolved)
   - Mock cost/time impact calculations displayed in recommendation pop-ups

4. **Enhanced Shipment Tracking View** (new: src/components/ShipmentTrackingView.tsx):
   - Mini-map showing specific shipment trajectory with current position
   - Real-time timeline/event log with mock updates
   - Action buttons panel with functional mock responses:
     - "Contact Carrier" → mock email/call interface
     - "Report Issue" → mock issue reporting form
     - "Approve Recommended Action" → trigger status changes across dashboard
   - Alternative route display with cost/time impact comparisons
   - Status changes that propagate back to main dashboard map

5. **Mock Real-Time Data Updates** (enhanced: src/data/mockData.ts):
   - Simulated data changes that trigger UI updates every few seconds
   - Mock "Agentforce matching" that gradually fills in "Quantity Matched" fields
   - Shipment status changes that update map colors and alert status
   - Live impact metrics counters (waste prevented, people helped, etc.)

6. **Operational Center Inventory View** (new: src/components/InventoryView.tsx):
   - Complete inventory tables with search/filter functionality
   - "Add New Inventory" and "Initiate Shipment" buttons with mock workflows
   - Inventory level warnings that trigger alerts
   - Mock automated suggestions for optimal resource allocation

7. **Dashboard Orchestration Features** (enhanced: src/components/Dashboard.tsx):
   - Mock notification system that triggers pop-up recommendations
   - State management for cross-component updates (alert → detail view → map update)
   - "Live Impact Metrics" panel with animated counters
   - Mock automated workflow triggers (every 10-15 seconds, simulate new events)

8. **Quick Action Workflows** (enhanced: src/components/Sidebar.tsx):
   - "Add New Corporate Donation" → mock donation entry form
   - "Manual Allocation Request" → mock resource request workflow
   - Filter functionality that actually filters displayed data
   - Search functionality across all entities

MOCK INTERACTION PATTERNS TO IMPLEMENT:

**Typhoon Genesis Simulation**:
- Timer-based mock disaster appearance (new red marker appears)
- Automated needs assessment population with delay animation
- Mock "Agentforce" matching with progressive quantity updates
- Simulated shipment delay alert → recommendation pop-up → approval workflow
- Status propagation: approval → map update → alert resolution

**Mock Data Requirements**:
- Pre-defined disaster scenarios with staged needs data
- Shipment status change sequences with timestamps
- Alert templates with recommendation options
- Cost/time impact calculation formulas
- Inventory level thresholds for warnings

**Real-Time Simulation**:
- Use setInterval for mock data updates every 3-5 seconds
- Animate number changes (e.g., quantity matched going from 0 → 100,000)
- Mock network delay simulation for "processing" states
- Sound/visual notifications for urgent alerts

OUTPUT REQUIREMENTS:

For each feature, provide:
1. **Complete component files** (.tsx) with TypeScript interfaces
2. **Mock data generators** for realistic scenario simulation  
3. **CSS classes** that match existing styling patterns
4. **State management logic** for cross-component updates
5. **Timer/animation code** for real-time simulation effects

Focus on making the interface feel "alive" and responsive, simulating the experience of Agentforce working in the background while giving Sarah clear decision points and immediate feedback on her actions.

Key Success Criteria:
- Sarah can click through the complete Typhoon Genesis workflow
- All buttons perform mock actions with visual feedback
- Status changes propagate across dashboard components
- Alerts lead to actionable recommendations
- The system feels proactive and intelligent, not just reactive

Technology Stack Reminders:
- React TypeScript with existing custom CSS styling
- Maintain emoji-based icons or suggest React icon library
- Use Framer Motion for smooth transitions
- Leaflet integration for enhanced map features
- Mock data patterns established in src/data/mockData.ts

