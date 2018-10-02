App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,
  instance:'',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) { 
        App.account = account;
        $("#account").text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
          }
        });
      }
    });
  },

  initContract: function() {
    web3.eth.defaultAccount = web3.eth.accounts[0];
    bookinContract = web3.eth.contract([{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":false,"name":"_fromDate","type":"uint256"},{"indexed":false,"name":"_toDate","type":"uint256"},{"indexed":false,"name":"_fromTime","type":"uint256"},{"indexed":false,"name":"_toTime","type":"uint256"}],"name":"addSlotEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_id","type":"uint256"},{"indexed":false,"name":"uname","type":"string"},{"indexed":false,"name":"ethAddress","type":"address"},{"indexed":false,"name":"_fromDate","type":"uint256"},{"indexed":false,"name":"_fromTime","type":"uint256"},{"indexed":false,"name":"_toTime","type":"uint256"}],"name":"addBookRequestEvent","type":"event"},{"constant":false,"inputs":[{"name":"Uname","type":"string"},{"name":"password","type":"string"}],"name":"registerConsumer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"Uname","type":"string"},{"name":"password","type":"string"}],"name":"loginCustomer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromDay","type":"uint256"},{"name":"_toDay","type":"uint256"},{"name":"_fromTime","type":"uint256"},{"name":"_toTime","type":"uint256"}],"name":"openSlots","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_slotId","type":"uint256"}],"name":"getSlotInfo","outputs":[{"name":"slotId","type":"uint256"},{"name":"owner","type":"address"},{"name":"fromday","type":"uint256"},{"name":"today","type":"uint256"},{"name":"fromTime","type":"uint256"},{"name":"toTime","type":"uint256"},{"name":"maxSlotTime","type":"uint256"},{"name":"bookstatus","type":"string"},{"name":"maxslotcounter","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSlotstoView","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"uname","type":"string"},{"name":"_day","type":"uint256"},{"name":"_fromTime","type":"uint256"},{"name":"_toTime","type":"uint256"}],"name":"bookSlot","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_slotId","type":"uint256"}],"name":"getBookingRequest","outputs":[{"name":"name","type":"string"},{"name":"consumerAddress","type":"address"},{"name":"day","type":"uint256"},{"name":"fromTime","type":"uint256"},{"name":"toTime","type":"uint256"},{"name":"status","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBookingRequestoView","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_day","type":"uint256"},{"name":"_fromTime","type":"uint256"},{"name":"apprdeny","type":"bool"}],"name":"approveDeny","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"}]);
    instance = bookinContract.at('0x69e5a32b4890e7fdc6193e3470f468d81db8ac2f');
    // Listen for events
    
    console.log(instance);

  },

adminlogin: function() {
    // retrieve details of the review
    console.log(instance);
    var _username = $("#input1").val();
    var _password = $("#input2").val();
    console.log("input1 value is ", _username);
    console.log("input2 value is ", _password);

    instance.loginCustomer.call(_username, _password,function(error,result){
      if(result){
        window.location.href = '/admin.html';
      }
    });     
    
   },
   clientlogin: function() {
    // retrieve details of the review
    console.log(instance);
    var _username = $("#input1").val();
    var _password = $("#input2").val();
    console.log("input1 value is ", _username);
    console.log("input2 value is ", _password);

    instance.loginCustomer.call(_username, _password,function(error,result){
      if(result){
        window.location.href = '/client.html';
      }
    });     
    
  },

clientregister: function() {
    // retrieve details of the review
    console.log(instance);
    var _username = $("#input1").val();
    var _password = $("#input2").val();
    console.log("input1 value is ", _username);
    console.log("input2 value is ", _password);

    instance.registerConsumer(_username, _password,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
      if(result){
        window.location.href = '/clogin.html';
      }else{
        swal("Failed to Register!", "Please try again later", "failure");
      }
    }); 
},
adminregister: function() {
  // retrieve details of the review
  console.log(instance);
  var _username = $("#input1").val();
  var _password = $("#input2").val();
  console.log("input1 value is ", _username);
  console.log("input2 value is ", _password);

  instance.registerConsumer(_username, _password,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
    if(result){
      window.location.href = '/alogin.html';
    }else{
      swal("Failed to Register!", "Please try again later", "failure");
    }
  }); 
},

openSlots: function() {
    // retrieve details of the review
    console.log(instance);
    var _fromDay  = parseInt((($("#input1").val()).toString()).replace(/-/g,''));
     console.log("dayis",_fromDay);
    // var mydate = new Date(_fromDay[0], _fromDay[1] - 1, _fromDay[2]); 
    // console.log("Fromday is ",mydate.toDateString());
    var _toDay  = parseInt((($("#input2").val()).toString()).replace(/-/g,''));
    var _fromTime = 900;
    var _toTime   = 1700;

    instance.openSlots(_fromDay, _toDay,_fromTime,_toTime,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
      if(result){
        console.log("result value is",result);
      }else{
        swal("Failed to Register!", "Please try again later", "failure");
      }
    }); 
},

getSlotInfo: function() {
  // retrieve details of the review
  console.log(instance);
  instance.getSlotstoView.call(function(error,slotIds){
    console.log("Slot details are ", slotIds.length);
    for (var i = 0; i <  slotIds.length; i++) {
        console.log("slotids is ", slotIds[i]);
        var slotid = slotIds[i] - 1;
        console.log('slotidvalueis', slotid);
        instance.getSlotInfo.call(slotid,function(error,slot) {
         $('#slot-id').append('<option value='+slot[0].toNumber()+ '>'+slot[0].toNumber()+'</option>');
        App.displaySlots(
          slot[0],
          slot[2],
          slot[3],
          slot[4],
          slot[5],
          slot[8]
        );
      });
     }
    });
 },

 displaySlots: function(slotid, fromday, today, fromtime,totime,maxSlotavailable) {
  // Retrieve the review placeholder

  var slotsRow = $('#slotsView');
  // Retrieve and fill the slots template
  var fromdy = fromday;
  var tody =  today;
  var ftime = '9:00 - 17:00';
  var slotTemplate = $('#slotsTemplate');
  slotTemplate.find('.slot-slotid').text(slotid);

  slotTemplate.find('.slot-fromDate').text(fromdy);
  slotTemplate.find('.slot-toDate').text(tody);
  slotTemplate.find('.slot-fromTime').text(ftime);
  slotTemplate.find('.slot-availability').text(maxSlotavailable);
  // add this new slots
  slotsRow.append(slotTemplate.html());
},

listenToBookRequestEvent: function() {
  // retrieve details of the review
  console.log("iam inside bookrequestevent",instance);
  instance.addBookRequestEvent(function(error,event){
    console.log("bookrequestevent event value is", event);  
  });
 },

 listenToOpenSlotEvent: function() {
  // retrieve details of the review
  console.log(instance);
  instance.addSlotEvent(function(error,event){
    if(event){
      App.getSlotInfo();
    }
  });
 },

 checkslots:function(){
 console.log(instance);
 var _hashval = $(".btn-view").attr("slot-id");
 console.log("btnvalue is ",_hashval);


 },

getdates:function(id){
  console.log(instance);
  console.log('id',id);
  var val = id-1;
  instance.getSlotInfo.call(val,function(error,slot) {

    var listDate = [];
    var startDate = (slot[2].toNumber()).toString();
    var endDate   = (slot[3].toNumber()).toString();

    var syy = startDate.substring(0,4);
    var smm = startDate.substring(4,6);
    var sdd = startDate.substring(6,8);
    var startwhole = syy + '-' + smm  + '-' + sdd;
    console.log(startwhole);

    var eyy = endDate.substring(0,4);
    var emm = endDate.substring(4,6);
    var edd = endDate.substring(6,8);
    var endwhole = eyy + '-' + emm  + '-' + edd;
    console.log(endwhole);

    var dateMove  = new Date(startwhole);
    console.log("dateMove",dateMove);
    var strDate   = startwhole;
    $('#slot-date').html('<option> </option>');

    while (strDate < endwhole){
      var strDate = dateMove.toISOString().slice(0,10);
      listDate.push(strDate);
      dateMove.setDate(dateMove.getDate()+1);
    };
    console.log(listDate);
    
    var len = listDate.length;
    for(i=0;i<len;i++)
    {
      $('#slot-date').append('<option value='+listDate[i]+ '>'+listDate[i]+'</option>');
    }

  });

},

checkTime:function(id,dd,tm){
  console.log(instance);
  console.log("idddtm",id,dd,tm);
  var _fromDay  = parseInt((dd.toString()).replace(/-/g,''));
  console.log("fromDayis",_fromDay);
  var _fromtm = tm.split('/');
  console.log("Fromtime",_fromtm[0],_fromtm[1]);
  instance.getBookingRequest()
},

showRequests:function(){
  instance.getBookingRequestoView.call(function(error,reqIDs){
    console.log("Slot details are ", reqIDs.length);
    for (var i = 0; i <  reqIDs.length; i++) {
        console.log("reqIDs is ", reqIDs[i]);
        var reqID = reqIDs[i] - 1;
        console.log('reqID', reqID);
        instance.getBookingRequest.call(reqID,function(error,reqval) {
        App.displayRequest(
          reqval[0],
          reqval[1],
          reqval[2],
          reqval[3],
          reqval[4],
          reqval[5]
        );
        console.log("reqvaluesis",reqval);
      });
     }
    });
},

displayRequest: function(uname, addr, day, fromtime,totime,status) {
  // Retrieve the review placeholder
  if(status=='Pending'){
    var requestView = $('#requestView');
    var requestTemplate = $('#requestTemplate');
    requestTemplate.find('.req-day').text(day);
    requestTemplate.find('.req-fromtime').text(fromtime);
    requestTemplate.find('.req-totime').text(totime);
    requestTemplate.find('.req-status').text(status);
    requestView.append(requestTemplate.html());
  }
  else if(status=='Accepted'){
    var acceptView = $('#acceptView');
    var acceptTemplate = $('#acceptTemplate');
    acceptTemplate.find('.req-day').text(day);
    acceptTemplate.find('.req-fromtime').text(fromtime);
    acceptTemplate.find('.req-totime').text(totime);
    acceptTemplate.find('.req-status').text(status);
    acceptView.append(acceptTemplate.html());
  }
  else if(status=='Denied'){
    var deniedView = $('#deniedView');
    var deniedTemplate = $('#deniedTemplate');
    deniedTemplate.find('.req-day').text(day);
    deniedTemplate.find('.req-fromtime').text(fromtime);
    deniedTemplate.find('.req-totime').text(totime);
    deniedTemplate.find('.req-status').text(status);
    deniedView.append(deniedTemplate.html());
  }

},


checkSlot:function(id,dd,tm){
  console.log(instance);
  console.log("idddtm",id,dd,tm);
  var _fromDay  = parseInt((dd.toString()).replace(/-/g,''));
  console.log("fromDayis",_fromDay);
  var _fromtm = tm.split('/');
  console.log("Fromtime",_fromtm[0],_fromtm[1]);

  var fromtime = parseInt(_fromtm[0]);
  var totime = parseInt(_fromtm[1]);

  instance.getBookingRequestoView.call(function(error,reqIDs){
    console.log("Slot details are ", reqIDs.length);
    $('#date-result').html('<p></p>');
    for (var i = 0; i <  reqIDs.length; i++) {
        console.log("reqIDs is ", reqIDs[i]);
        var reqID = reqIDs[i] - 1;
        console.log('reqID', reqID);
        instance.getBookingRequest.call(reqID,function(error,reqval) {
          console.log("reqvalis",reqval);
          if((reqval[2]==_fromDay) && (reqval[3]==fromtime) && (reqval[4]==totime) && (reqval[5] != 'Denied')){
            $('#date-result').html('<p style="color:red;">Slot already booked! </p>');
          }
      });
     }
    });
 },


bookSlot:function(id,dd,tm){
  console.log(instance);
  console.log("idddtm",id,dd,tm);
  var _fromDay  = parseInt((dd.toString()).replace(/-/g,''));
  console.log("fromDayis",_fromDay);
  var _fromtm = tm.split('/');
  console.log("Fromtime",_fromtm[0],_fromtm[1]);

  var fromtime = parseInt(_fromtm[0]);
  var totime = parseInt(_fromtm[1]);
   instance.bookSlot("user",_fromDay,fromtime,totime,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
    if(result){
      console.log("result value is",result);
      App.showRequests();
    }else{
      swal("Booking Failed!", "Please try again later", "failure");
    }
  }); 
 },


 acceptDeny:function(frd,frt,tot,apr){
  console.log(instance);
  console.log("Flagvalue is ",frd,frt,tot,apr);
  var frdd = parseInt(frd);
  var frtt = parseInt(frt);

  var apprdeny;
  if(apr=='accept'){
    apprdeny=true;
  }else{
    apprdeny=false;
  }
  console.log(apprdeny);

  instance.approveDeny(frdd,frtt,apprdeny,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
    if(result){
      console.log("result value is",result);
      App.showRequests();
    }else{
      swal("Approve or Deny!", "Please try again later", "failure");
    }
  }); 
 },

};

$(function() {
  $(window).load(function() {
    App.init();
    App.listenToBookRequestEvent();
    App.listenToOpenSlotEvent();
    App.getSlotInfo();
    App.showRequests();
  });
});
