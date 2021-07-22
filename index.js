const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');
const moment = require('moment');
const settingsBill = SettingsBill();

 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir:__dirname + '/views/layouts'}));
app.set('view engine', 'handlebars');

app.listen(PORT, function() {
   
});
 
app.get("/", (req, res)=>{
  if (settingsBill.values().warn === undefined ) {
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      gTot: 'gTot'
    });
  } else if (settingsBill.notCritWarn()) {
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      gTot: 'gTot'
    });
  } else if (settingsBill.hasReachedWarningLevel()) {
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      gTot: 'warning'
    });
  } else if (settingsBill.hasReachedCriticalLevel()) {
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals(),
      gTot: 'danger' 
    }); 
  }
});

app.use(express.static('public')); 

app.post("/settings", (req, res)=>{  
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel,
    });

    res.redirect('/');
});

app.post("/action", (req, res)=>{
  settingsBill.recordAction(req.body.actionType)
  res.redirect('/');
});

app.get("/actions", (req, res)=>{
    res.render('actions', {
      actions: settingsBill.actions()
    });
});

app.get("/actions/:actionType", (req, res)=>{
  const actionType = req.params.actionType;
  res.render('actions', {
    actions: settingsBill.actionsFor(actionType)
  });
});


