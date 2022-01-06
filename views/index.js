// const Caver = require('caver-js');
// const {Spinner} = require('spin.js');

// const config = {
//   rpcURL: 'https://api.baobab.klaytn.net:8651'
// }

// const cav = new Caver(config.rpcURL);
// const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

// const App = {
//   auth: {
//     accessType: 'keystore',
//     keystore: '',
//     password: ''
//   },
  
//   //초기화
//   start: async function () {
//     const walletFromSession = sessionStorage.getItem('walletInstance');
//     console.log(DEPLOYED_ADDRESS);
//     if (walletFromSession) {
//       try {
//         cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
//         this.changeUI(JSON.parse(walletFromSession));
//       } catch (e) {      
//         sessionStorage.removeItem('walletInstance');
//       }
//     }
//   },
  
// // keystore 유효성 검사
//   handleImport: async function () {
//     const fileReader = new FileReader();
//     fileReader.readAsText(event.target.files[0]);
//     fileReader.onload = (event) => {      
//       try {     
//         if (!this.checkValidKeystore(event.target.result)) {
//           $('#message').text('유효하지 않은 keystore 파일입니다.');
//           return;
//         }    
//         this.auth.keystore = event.target.result;
//         $('#message').text('keystore 통과. 비밀번호를 입력하세요.');
//         document.querySelector('#input-password').focus();    
//       } catch (event) {
//         $('#message').text('유효하지 않은 keystore 파일입니다.');
//         return;
//       }
//     }   
//   },

//   handlePassword: async function () {
//     this.auth.password = event.target.value;
//   },

//   handleLogin: async function () {
//     if (this.auth.accessType === 'keystore') { 
//       try {
//         const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
//         this.integrateWallet(privateKey);
//       } catch (e) {      
//         $('#message').text('비밀번호가 일치하지 않습니다.');
//       }
//     }
//   },

//   handleLogout: async function () {
//     this.removeWallet();
//     location.reload();
//   },

//   generateNumbers: async function () {
//     var param1 = {
//       "Account":"1",
//       "Maker": "KIA",
//       "Model": "SUV",
//       "Color": "Blue",
//       "Number": "23나1298"}

//     sessionStorage.setItem('Number', param1.Number);
//     $('#start').hide();
//     $('#question').show();
//     document.querySelector('#answer').focus();
//   }, 

//   signupCar: async function () {
//     const walletInstance = this.getWallet();
//     var userid = walletInstance.address;
//     location.href='http://localhost:3000/register.html?userid=' + userid;
//     alert(d);
//   },

// //작동 X
//   submitAnswer: async function () {
//     const Number = sessionStorage.getItem('Number');

//     var answer = $('#answer').val(); 
//     if (answer === Number) {
//       if (confirm("정상적으로 인증되었습니다.")) {
//         if (await this.callContractBalance() >= 0.1) {         
//           this.receiveKlay();
//         }   
//       }
//     } else {
//       alert("등록된 정보가 없습니다.");
//     }
//   },

//   deposit: async function () {
//     var spinner = this.showSpinner();
//     const walletInstance = this.getWallet();
//     const conStr = new String(await this.callOwner());
//     const lowerOwner=conStr.toLowerCase()

//     if (walletInstance) {
//       console.log("lowerOwner",lowerOwner);
//       console.log("walletInstance.address",walletInstance.address);
//       console.log("test2",await lowerOwner !== walletInstance.address);
     
//      if (await lowerOwner !== walletInstance.address) return; 
//      else {
//        var amount = $('#amount').val();
//        console.log("amount",amount);
//        if (amount) {
//          agContract.methods.deposit().send({
//            from: walletInstance.address,
//            gas: '200000',
//            value: cav.utils.toPeb(amount, "KLAY")
//          })        
//          .once('transactionHash', (txHash) => {
//            console.log(`txHash: ${txHash}`);
//          })
//          .once('receipt', (receipt) => {
//            console.log(`(#${receipt.blockNumber})`, receipt); //Received receipt! It means your transaction(calling plus function) is in klaytn block                          
//            spinner.stop();  
//            alert(amount + " KLAY를 컨트랙에 송금했습니다.");               
//            location.reload();      
//          })
//          .once('error', (error) => {
//            alert(error.message);
//          }); 
//        }
//        return;    
//      }
//    }
//  },

//   callOwner: async function () {
//     return await agContract.methods.owner().call();
//   },

//   callContractBalance: async function () {
//     return await agContract.methods.getBalance().call();
//   },
 
//   getWallet: function () {
//     if (cav.klay.accounts.wallet.length) {
//       return cav.klay.accounts.wallet[0];
//     }
//   },

//   checkValidKeystore: function (keystore) {
//     const parsedKeystore = JSON.parse(keystore);
//     const isValidKeystore = parsedKeystore.version &&
//       parsedKeystore.id &&
//       parsedKeystore.address &&
//       parsedKeystore.keyring[0]; 

//     return isValidKeystore;
//   },

//   integrateWallet: function (privateKey) {
//     const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
//     cav.klay.accounts.wallet.add(walletInstance)
//     sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
//     this.changeUI(walletInstance);  
//   },

//   reset: function () {
//     this.auth = {
//       keystore: '',
//       password: ''
//     };
//   },

//   //start, integratedwallet에서 호출
//   //계정에 맞춘 UI 표시
//   changeUI: async function (walletInstance) {
//     $('#loginModal').modal('hide');
//     $("#login").hide();
//     $('#signupCar').show(); 
//     $('#logout').show();
//     $('#game2').show();
//     $('#game').show();
//     $('#address').append('<br>' + '<p>' + '내 계정 주소: ' + walletInstance.address + '</p>');   
//     $('#contractBalance').html("");
//     cav.klay.getBalance(walletInstance.address).then((userbalance) => $('#contractBalance').append('<p>'+'계정 잔액 klay: '+ cav.utils.fromPeb(userbalance, "KLAY") + ' KLAY' + '</p>'));
    
//     const conStr = new String(await this.callOwner());
//     const lowerOwner=conStr.toLowerCase()
//     if (await lowerOwner === walletInstance.address) {
//       $("#owner").show(); 
//     }     
//   },

//   removeWallet: function () {
//     cav.klay.accounts.wallet.clear();
//     sessionStorage.removeItem('walletInstance');
//     this.reset();
//   },

//   showSpinner: function () {
//     var target = document.getElementById('spin');
//     return new Spinner(opts).spin(target);
//   },

//   //작동 X
//   receiveKlay: function() {
//     var spinner = this.showSpinner();
//     const walletInstance = this.getWallet();

//     if (!walletInstance) return;  

//     agContract.methods.transfer(cav.utils.toPeb("0.1", "KLAY")).send({
//       from: walletInstance.address,
//       gas: '250000'
//     }).then(function (receipt) {
//       if (receipt.status) {
//         spinner.stop();  
              
//         $('#transaction').html("");
//         $('#transaction').append(`<p><a href='https://baobab.scope.klaytn.com/tx/${receipt.transactionHash}' target='_blank'>클레이튼 Scope에서 트랜젝션 확인</a></p>`);
        
//         return agContract.methods.getBalance().call()
//           .then(function (balance) {
//             $('#contractBalance').html("");
//         });        
//       }
//     });      
//   },
  
//   directsend: async function() {
//     const walletInstance = this.getWallet();

//     if (!walletInstance) return;  

//     agContract.methods.transfer(cav.utils.toPeb("0.0", "KLAY")).send({
//       from: walletInstance.address,
//       gas: '250000'
//     }).then(function (receipt) {
//       if (receipt.status) {
//         //$('#transaction').html("");
//         //$('#transaction').append(`<p><a href='https://baobab.scope.klaytn.com/tx/${receipt.transactionHash}' target='_blank'>클레이튼 Scope에서 트랜젝션 확인</a></p>`);
//         //$('#transaction').append(`<p>정상적으로 처리되었습니다.</p>`);
//         $('#myModal2').modal('show');  
      
//         return agContract.methods.getBalance().call()
//           .then(function (balance) {
//             $('#contractBalance').html("");
//         });     
//       }
//     });
//   },
// };

// window.App = App;

// window.addEventListener("load", function () { 
//   App.start();
// });

// function Request(){
// 	var requestParam ="";
//         this.getParameter = function(param){
//     	var url = unescape(location.href); //현재 주소를 decoding
//         var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&"); //파라미터만 자르고, 다시 &그분자를 잘라서 배열에 넣는다. 
//         for(var i = 0 ; i < paramArr.length ; i++){
//             var temp = paramArr[i].split("="); //파라미터 변수명을 담음
//             if(temp[0].toUpperCase() == param.toUpperCase()){
//             	requestParam = paramArr[i].split("=")[1]; // 변수명과 일치할 경우 데이터 삽입
//                 break;
//             }
//         }
//         return requestParam;
//     };
// }

// var request = new Request();

// window.onload =  function () {
//   var flag = request.getParameter('flag');
  
//   if (flag == '1'){
//       $('#myModal').modal('show');
//   }
//   else if(flag == '2'){
//     alert('등록되지 않은 차량입니다');
//   }
// }

// //spinner 옵션
// var opts = {
//   lines: 10, // The number of lines to draw
//   length: 30, // The length of each line
//   width: 17, // The line thickness
//   radius: 45, // The radius of the inner circle
//   scale: 1, // Scales overall size of the spinner
//   corners: 1, // Corner roundness (0..1)
//   color: '#5bc0de', // CSS color or array of colors
//   fadeColor: 'transparent', // CSS color or array of colors
//   speed: 1, // Rounds per second
//   rotate: 0, // The rotation offset
//   animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
//   direction: 1, // 1: clockwise, -1: counterclockwise
//   zIndex: 2e9, // The z-index (defaults to 2000000000)
//   className: 'spinner', // The CSS class to assign to the spinner
//   top: '50%', // Top position relative to parent
//   left: '50%', // Left position relative to parent
//   shadow: '0 0 1px transparent', // Box-shadow for the lines
//   position: 'absolute' // Element positioning
// };