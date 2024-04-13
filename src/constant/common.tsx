export const STATE_DOCUMENT_VALUE = {
    Draft: 'draft',
    Check: 'open',
    Done: 'done',
    Cancel: 'cancel'
};

export const STATE_DOCUMENT_NAME = {
    Draft: 'Draft',
    Check: 'Check',
    Done: 'Done',
    Cancel: 'Cancelled'
};

export const USE_STATE_ASSET = {
    Normal: 2,
    Damaged: 3,
    Repair: 4
};

export const USE_STATE_ASSET_TH = {
    Normal: 'ปกติ',
    Damaged: 'ชำรุด',
    Repair: 'รอส่งซ่อม'
};

export const USE_STATE_ASSET_NORMAL_EN = 'Normal';

export const SOMETHING_WENT_WRONG = 'Something went wrong! Try Again';

export const WARNING = 'Warning';

export const ALL_LOCATION = 'All Location';

export const MOVEMENT_ASSET_NORMAL_TH = 'ปกติ';

export const MOVEMENT_ASSET = {
    Normal: '0',
    New: '1',
    Transfer: '2'
};

export const MOVEMENT_ASSET_EN = {
    Normal: 'Normal',
    New: 'New',
    Transfer: 'Transfer'
};

export const REPORT_TYPE = {
    New: 'Asset New',
    Found: 'Asset Found',
    NotFound: 'Asset Not Found',
    Transfer: 'Asset Transfer'
};

export const RESPONSE_DELETE_DOCUMENT_LINE_ASSET_NOT_FOUND =
    'Asset data not found';
export const RESPONSE_PUT_DOCUMENT_SUCCESS =
    'Asset tracking record updated successfully';
export const STATE_ASSET = ['draft', 'running'];
