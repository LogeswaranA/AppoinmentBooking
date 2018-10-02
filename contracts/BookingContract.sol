    pragma solidity ^0.4.21;
    
    import "./Owned.sol";

    contract BookingContract is Owned{
    
        //  Struct Calendar
        //  owner - username of the customer
        //  consumer - Consumer address
        //  day - Calendar Day
        //  fromTime - Beginning time of the day
        //  toTime -  Ending Time of the Day
        //  maxSlotTime - Time duration that calendar can be blocked
    
        // @dev main Calendar strucutre
        struct Calendar {
            // slotcounter
            uint slotId;
            // owner
            address owner;
            // identify fromDay
            uint256 fromDay;
            // identify toDay
            uint256 toDay;
            // From time
            uint256 fromTime;
            //To time
            uint256 toTime;
            // max slot time (unit of time, i.e. thirty minutes = 1800*0.5 seconds)
            uint256 maxSlotTime;
            //status 
            string bookstatus;
            //Maximum slots a day can have 16
            uint maxslotcounter;
        }
    
        //  Struct Consumers
        //  name - name of the consumer
        //  address - address of the consumer
        //  meetCount - number of meeting slot booked by this consumer
        //  password - password to store 
    
        struct Consumer {
            string name;
            address ethAddress;
            string password;
            uint meetCount;
        }
    
        //  Struct Request
        //  uname - name of the consumer
        //  ethAddress - address of the consumer
        //  isAllowed - 
        //  day - day of the month
        //  year - Year of the schedule
        // fromTime - meeting Beginning time
        // toTime - Meeting End time
        // approveStatus - acceptance Status
    
        struct Request {
            uint _id;
            string uname;
            address ethAddress;
            uint day;
            uint fromTime;
            uint toTime;
            string approveStatus;
        }
        
        //Events to capture Adding Open slot
        event addSlotEvent(
            uint indexed _id,
       	    uint _fromDate,
        	uint _toDate,
        	uint _fromTime,
        	uint _toTime
        );
        
        //Events to capture booking Request
        event addBookRequestEvent(
            uint indexed _id,
            string uname,
            address ethAddress,
       	    uint _fromDate,
        	uint _fromTime,
        	uint _toTime
        );
                
        
        //Counter to have slots
        uint slotCounter;
        
        //Counter to have getBookingRequest
        uint bookCounter;
    
        //list of all calendar slot
        Calendar[] allCalendars;
    
        //list of all consumers
        Consumer[] allConsumers;
    
        // list of all requests
        Request[] allRequests;
        
        
        //  function to add a consumer profile to the database
        //  returns 0 if successful
        //  returns 2 if customer already in network
    
        function registerConsumer(string Uname, string password) public returns(uint) {
            //  throw error if username already in use
            for(uint i = 0;i < allConsumers.length; ++ i) {
                if(stringsEqual(allConsumers[i].name, Uname))
                    return 2;
            }
            allConsumers.length ++;
            //  throw error if there is overflow in uint
            if(allConsumers.length < 1)
                return 1;
            allConsumers[allConsumers.length-1] = Consumer(Uname, msg.sender,password,0);
            return 0;
        }
        
        //  function to Check if consumer is registered
        //  returns 0 if successful
        
        function loginCustomer(string Uname, string password) public returns(bool) {
            for(uint i = 0; i < allConsumers.length; ++ i) {
                if(stringsEqual(allConsumers[i].name, Uname) && stringsEqual(allConsumers[i].password, password)) {
                    return true;
                }
                if(stringsEqual(allConsumers[i].name, Uname)) {
                    return false;
                }
            }
            return false;
        }
    
        //  function to open slots in calendar
        //  returns 0 if successful
    
        function openSlots(uint _fromDay,uint _toDay, uint _fromTime, uint _toTime) public payable returns(bool) {
            uint actualslot = ((_toDay - _fromDay) + 1) * 16;

            string memory status = "free";
            uint slotTime = 1800*0.5;
            for(uint i = 0;i < allCalendars.length; ++ i) {
                if((allCalendars[i].fromDay==_fromDay) &&  (allCalendars[i].toDay==_toDay)  && (allCalendars[i].fromTime==_fromTime) && (allCalendars[i].toTime==_toTime))
                    return false ;
            }
            allCalendars.length ++;
            //  throw error if there is overflow in uint
            if(allCalendars.length < 1)
                return false;
            slotCounter++;
            allCalendars[allCalendars.length-1] = Calendar(slotCounter, msg.sender,_fromDay,_toDay,_fromTime,_toTime,slotTime,status,actualslot);
            
            //call event to capture
            addSlotEvent(slotCounter,_fromDay,_toDay,_fromTime,_toTime);
            
            return true;
        }
        
    	//  function to open slots in calendar
        //  returns 0 if successful
    	
    	function getSlotInfo(uint256 _slotId) external view
            returns (uint slotId,address owner,uint fromday, uint256 today,uint256 fromTime,uint256 toTime, uint256 maxSlotTime,string bookstatus,uint maxslotcounter)
            {
            Calendar storage cal = allCalendars[_slotId];
            slotId = cal.slotId;
            owner = cal.owner;
            fromday = cal.fromDay;
            today = cal.toDay;
            fromTime = cal.fromTime;
            toTime = cal.toTime;
            maxSlotTime = cal.maxSlotTime;
            bookstatus = cal.bookstatus;
            maxslotcounter = cal.maxslotcounter;
    
        }
          // fetch and returns all reviews IDs available for visitor
      function getSlotstoView() public constant returns (uint[]) {
        // we check whether there is at least one review
        if(slotCounter == 0) {
          return new uint[](0);
        }
        // prepare intermediary array
        uint[] memory slotIds = new uint[](slotCounter);
        uint numberofSlotstoView = 0;
        // iterate over reviews
        for (uint i = 0; i < slotCounter; i++) {
            slotIds[numberofSlotstoView] = allCalendars[i].slotId;
            numberofSlotstoView++;
        }
        // copy the reviewsID array into the smaller forReview array
        uint[] memory forView = new uint[](numberofSlotstoView);
        for (uint j = 0; j < numberofSlotstoView; j++) {
          forView[j] = slotIds[j];
        }
        return (forView);
      }
    
        // Function to Bookslot
        // return code 4 - record already exists
        // return code 2 - requested date not in Calendar
        // return code 1 - booking reuqest successfully
        function bookSlot(string uname,uint256 _day, uint256 _fromTime, uint256 _toTime) public payable returns(uint) {
           for(uint i = 0;i < allCalendars.length; i++ ) {
                if((_day >= allCalendars[i].fromDay ) && (_day<= allCalendars[i].toDay) && (_fromTime >=allCalendars[i].fromTime) && (_toTime<=allCalendars[i].toTime) && (allCalendars[i].maxslotcounter > 0) ){
                    for(uint j = 0;j<allRequests.length; j++){
                        if((_day == allRequests[j].day) && (allRequests[j].fromTime==_fromTime) && (allRequests[j].toTime==_toTime) && ((stringsEqual(allRequests[j].approveStatus, 'Accepted')) || (stringsEqual(allRequests[j].approveStatus, 'Pending')) )){
                            return 4;
                        }
                    }
                    allRequests.length++;
                    allCalendars[i].maxslotcounter = allCalendars[i].maxslotcounter - 1;
                    allCalendars[i].bookstatus='requested';
                }else{
                    continue;
                }
    
           }
            bookCounter++;
            allRequests[allRequests.length-1] = Request(bookCounter,uname,msg.sender,_day,_fromTime,_toTime,"Pending");
            
            //Call Event to capture the same
            addBookRequestEvent(bookCounter,uname,msg.sender,_day,_fromTime,_toTime);    
            
            return 1;
    	}
    	
       // Function to getBookingRequest
    	function getBookingRequest(uint256 _slotId) external view
            returns (string name,address consumerAddress, uint256 day,uint256 fromTime,uint256 toTime, string status)
            {
            Request storage req = allRequests[_slotId];
            name = req.uname;
            consumerAddress = req.ethAddress;
            day = req.day;
            toTime = req.toTime;
            fromTime = req.fromTime;
            status = req.approveStatus;
        }
        
                  // fetch and returns all reviews IDs available for visitor
      function getBookingRequestoView() public constant returns (uint[]) {
        // we check whether there is at least one review
        if(bookCounter == 0) {
          return new uint[](0);
        }
        // prepare intermediary array
        uint[] memory bookIds = new uint[](bookCounter);
        uint numberofRequesttoView = 0;
        // iterate over reviews
        for (uint i = 0; i < bookCounter; i++) {
            bookIds[numberofRequesttoView] = allRequests[i]._id;
            numberofRequesttoView++;
        }
        // copy the reviewsID array into the smaller forReview array
        uint[] memory forView = new uint[](numberofRequesttoView);
        for (uint j = 0; j < numberofRequesttoView; j++) {
          forView[j] = bookIds[j];
        }
        return (forView);
      }
    
       // Function to compare strings
        function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
    		bytes storage a = bytes(_a);
    		bytes memory b = bytes(_b);
    		if (a.length != b.length)
    			return false;
    		// @todo unroll this loop
    		for (uint i = 0; i < a.length; i ++)
            {
    			if (a[i] != b[i])
    				return false;
            }
    		return true;
    	}
    	
        // Function to approve or deny
        function approveDeny(uint256 _day,uint256 _fromTime, bool apprdeny) public payable returns(uint){
            for(uint i = 0; i <allRequests.length; i++) {
                if((allRequests[i].day == _day)  && (allRequests[i].fromTime == _fromTime)) {
                    
                    for(uint j=0; j< allCalendars.length; j++){
                        if((_day >= allCalendars[j].fromDay ) && (_day<= allCalendars[j].toDay)  && (_fromTime >= allCalendars[j].fromTime) && (_fromTime <= allCalendars[j].toTime) ){
                            if(apprdeny){
                                 allRequests[i].approveStatus = 'Accepted';
                                 return 1;
                            }else{
                                 allRequests[i].approveStatus = 'Denied';
                                 allCalendars[j].maxslotcounter =  allCalendars[j].maxslotcounter + 1;
                                 return 2;
                            }
                        }else{
                            continue;
                        }
                    }
                  }else
                  {
                      continue;
                  }
                return 4;
            }
        }
    	
    	
    	
    }
