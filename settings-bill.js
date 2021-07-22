module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;
    let grandTot = 0;
    const moment = require('moment');

    let actionList = [];
    let list = [];

    function setSettings (settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    function getSettings() {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {

        let cost = 0;

        if (grandTotal() < criticalLevel) {
            if (action === 'sms'){
                cost = smsCost;
            }
            else if (action === 'call'){
                cost = callCost;
            }
    
            if (action != undefined) {
                actionList.push({
                    type: action,
                    cost,
                    timestamp: new Date
                });
                list.push({
                    type: action,
                    cost,
                    timestamp: new Date
                });
            }

            for (let i = 0; i < list.length; i++) {
                let timeStamp = moment(actionList[i].timestamp).format('YYYY-MM-DD hh:mm:ss a');
                list[i].timestamp = (moment(timeStamp, 'YYYY-MM-DD hh:mm:ss a').fromNow());
            }
        }  
    }


    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];

        for (let index = 0; index < list.length; index++) {
            const action = list[index];
            
            if (action.type === type) {    
                filteredActions.push(action);
            } else if (type === 'total') {
                filteredActions.push(action);
            }
        }
       
        return filteredActions;
    }

    function getTotal(type) {
        let total = 0;
        
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal() {
        let gTot = getTotal('sms') + getTotal('call')
        grandTot = Number(gTot).toFixed(2);
        return Number(gTot).toFixed(2);
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2);
        let callTotal = getTotal('call').toFixed(2);

        return {
            smsTotal,
            callTotal,
            grandTotal : grandTotal() 
        }
    }

    function hasReachedWarningLevel(){
        const total = grandTotal();

        if (total + callCost >= warningLevel && total + callCost < criticalLevel) {
            return true;
        } else if (total + smsCost >= warningLevel && total + smsCost < criticalLevel) {
            return true;
        } else if (total >= warningLevel && total < criticalLevel) {
            return true;
        }
        return false;
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();

        if (total + callCost >= criticalLevel || total + smsCost >= criticalLevel) {
            return true;
        } else if (total >= criticalLevel) {
            return true;
        }
        return false;  
    }

    function notCritWarn() {
        const total = grandTotal();
        if (total < warningLevel && total < criticalLevel) {
           return true; 
        }
        return false;
    }

    function values(){
        return {
            warn: warningLevel,
            crit: criticalLevel,
            grand: grandTot,
        }
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        values,
        grandTotal,
        notCritWarn,
    }
}