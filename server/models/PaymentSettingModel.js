const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({
    
    store_id: { type: String, required: true }, 
    store_password: { type: String, required: true }, 
    currency: { type: String, required: true }, 
    success_url: { type: String, required: true }, 
    failure_url: { type: String, required: true }, 
    cancle_url: { type: String, required: true },
    ipn_url: { type: String, required: true },
    init_url: { type: String, required: true },
    
},
    {
        timeStamsp: true ,versionKey: false
    }
)
const PaymentSettingModel = mongoose.model('payment_settings', DataSchema);
module.exports = PaymentSettingModel;