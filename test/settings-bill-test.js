const assert = require('assert');

const SettingsBill = require('../settings-bill');

describe('settings-bill', ()=>{

    const settingsBill = SettingsBill();

    it('Should be able to record the number of calls.', ()=>{
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        });
        settingsBill.recordAction('call');
        assert.equal('1', settingsBill.actionsFor('call').length);
    });

    it('Should be able to record the number of smses.', ()=>{
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        });
        settingsBill.recordAction('sms');
        assert.equal('1', settingsBill.actionsFor('sms').length);
    });

    it('Should be able to set the settings.', ()=>{
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        }, settingsBill.getSettings())


    });

    it('Should calculate the call total, sms total, and grand total.', ()=>{
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(1.50, settingsBill.totals().smsTotal);
        assert.equal(2.25, settingsBill.totals().callTotal);
        assert.equal(3.75, settingsBill.totals().grandTotal);

    });

    it('Should calculate the total of both calls and smses.', ()=>{
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.25,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(6.00, settingsBill.totals().smsTotal);
        assert.equal(9.00, settingsBill.totals().callTotal);
        assert.equal(15.00, settingsBill.totals().grandTotal);

    });

    it('Should know when the warning level is reached.', ()=>{
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('Should know when the danger/critical level is reached.',()=>{
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
});