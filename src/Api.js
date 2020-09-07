import { serve } from '@triframe/arbiter'
import { cdnHandler, cdnUploadHandler } from '@triframe/s3-storage'

serve('./src/models', {
    cdnHandler,
    cdnUploadHandler,
    session: {
        loggedInUserId: null,
        loggedInUserRole: null
    },
})