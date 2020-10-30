import { serve } from '@triframe/arbiter'
import { cdnHandler, cdnUploadHandler } from '@triframe/s3-storage'
import path from 'path'

serve(path.resolve(__dirname, './models'), {
    cdnHandler,
    cdnUploadHandler,
    session: {
        loggedInUserId: null,
        loggedInUserRole: null,
        packageIds: []
    },
})