const electron = require('electron');
const url =require('url');
const path =require('path');
const {app,BrowserWindow,Menu,ipcMain}= electron;
process.env.NODE_ENV='production';
let mainWindow;
let addWindow;
//listen for the app to be ready 
app.on('ready', function(){
//creat a new window 
mainWindow=new BrowserWindow({
    webPreferences: {
    nodeIntegration: true
    }
});
// load html file in the window
mainWindow.loadURL(url.format({
    pathname:path.join(__dirname,"mainwindow.html"),
    protocol:'file:',
    slashes:true
}));
// quit app when closeed
mainWindow.on('close',function(){
    app.quit();
})
// build menu from template 
const menu = Menu.buildFromTemplate(mainMenuTemplate);
// insert the menu
Menu.setApplicationMenu(menu);
});
function createAddWindow(){
addWindow=new BrowserWindow({
    width:300,
    height:200,
    title:'add note',
    webPreferences:{
        nodeIntegration:true
    }
});
// load html file in the window
addWindow.loadURL(url.format({
    pathname:path.join(__dirname,"addwindow.html"),
    protocol:'file:',
    slashes:true
}));
// garbage collection
addWindow.on('close',function(){
addWindow=null;
})
}
// catch item
ipcMain.on('note:add',function(e,note){
    mainWindow.webContents.send('note:add',note);
    addWindow.close();
});
// create menu template
const mainMenuTemplate=[
{
    label:'File',
    submenu:[
        {
            label:'addnote',
            click(){
                createAddWindow();
            }
        },
        {
            label:'clear',
            click(){
                mainWindow.webContents.send("notes:clear");
            }
        },
        {
            label:'quit',
            accelerator:process.platform =='darwin' ? 'Command+Q':'Ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]
}
];
// if mac add empty object to menu 
if(process.platform =='darwin'){
    mainMenuTemplate.unshift({});
}
// add dev tool if not in prod
if(process.env.NODE_ENV!=='production'){
    mainMenuTemplate.push({
        label:'developer tools',
        submenu:[
            {
                label:'toggel dev tools',
                accelerator:process.platform =='darwin' ? 'Command+I':'Ctrl+I',
                click(item,fousedWindow){
                    fousedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    
    })
}