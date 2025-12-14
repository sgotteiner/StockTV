# Bug Fix: Import Path Errors

## ✅ FIXED

### Issue:
```
ERROR in ./src/services/api.js 3:0-30
Module not found: Error: Can't resolve './config'
```

### Root Cause:
The `api.js` file had incorrect relative import paths:
- Was: `import config from './config'`
- Should be: `import config from '../config'`

### Fix Applied:
Updated `frontend/src/services/api.js`:
```javascript
// Before:
import config from './config';
import { PAGINATION } from './constants';

// After:
import config from '../config';
import { PAGINATION } from '../constants';
```

### Verification:
Checked all other service files - they all have correct imports:
- ✅ `userProfileApi.js`
- ✅ `uploadApi.js`
- ✅ `interactionsApi.js`
- ✅ `companyApi.js`
- ✅ `authApi.js`
- ✅ `adminApi.js`

## 🎯 Status:
**RESOLVED** - Frontend should compile now!

Try restarting the frontend dev server if the error persists.
