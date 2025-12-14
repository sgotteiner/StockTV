# Code Cleanup Plan

## Issues Found & Fixes

### 1. **Long Files (>100 lines)**
- ❌ UserProfile.js (194 lines) - Split into smaller components
- ❌ VideoCard.js (188 lines) - Extract logic to hooks
- ❌ interactionStorage.js (174 lines) - Already well-organized, acceptable
- ❌ FeedScreen.js (152 lines) - Extract pagination logic
- ❌ videoStorage.js (151 lines) - Already well-organized, acceptable
- ❌ UploadScreen.js (140+ lines) - Extract form logic

### 2. **Duplicate Code**
- ❌ File reading/writing logic repeated in storage files
- ❌ Error handling patterns repeated
- ❌ API fetch patterns repeated

### 3. **Magic Numbers/Strings**
- ✅ Pagination constants - DONE
- ❌ Role strings ('user', 'admin', etc.) - Need constants
- ❌ API endpoints - Need constants
- ❌ Error messages - Need constants

### 4. **Missing Utilities**
- ❌ No shared file I/O utility
- ❌ No shared API error handler
- ❌ No shared validation helpers
- ❌ No shared date formatting

### 5. **Separation of Concerns**
- ❌ UI components contain business logic
- ❌ Some components do too many things

## Cleanup Strategy

### Phase 1: Create Shared Utilities
1. backend/utils/fileIO.js - Shared file operations
2. backend/utils/errorHandler.js - Consistent error handling
3. backend/config/constants.js - Add role constants, API paths
4. frontend/src/utils/apiClient.js - Shared fetch wrapper
5. frontend/src/constants.js - Add role constants, routes

### Phase 2: Extract Business Logic
1. Extract UserProfile stats logic to custom hook
2. Extract VideoCard interaction logic to custom hook
3. Extract FeedScreen pagination to custom hook
4. Extract form validation to utilities

### Phase 3: Split Large Components
1. UserProfile → ProfileView + ProfileEdit + ProfileStats
2. VideoCard → keep main, extract VideoControls
3. UploadScreen → UploadForm + CompanySelector

### Phase 4: Refactor Storage Layer
1. Use shared fileIO utility
2. Consistent error handling
3. Add JSDoc comments

### Phase 5: Final Polish
1. Remove console.logs
2. Add error boundaries
3. Consistent naming
4. Update documentation
