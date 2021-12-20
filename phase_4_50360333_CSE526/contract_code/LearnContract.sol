import "./LearnToken.sol";


contract LearnContract{

	
    

    struct Organization{
    	address owner;
    	string name;
    	bool isActive;
    	uint normalSubscriptionFee;
    	uint premiumSubscriptionFee;
    	mapping(address => uint) userSubscriptionTimes;
    	mapping(address => uint) userPremiumSubscriptionTimes;
    	uint normalSubscriptionTime;
    	uint premiumSubscriptionTime;
    }


    address public owner;
    LearnToken learnToken;
    mapping(address => Organization) organizations;
    uint orgRegistrationFee = 50;
    

    constructor (LearnToken _learnToken) public {
        owner = msg.sender;
        learnToken = _learnToken;
    }
    
    
    
    modifier onlyOrganization(address _org_address) {
      require(msg.sender == organizations[_org_address].owner,"You are not the owner of the organization");
      _;
    }



    function registerAsOrganization(string memory _name, uint normalSubFee, uint premiumSubFee) public payable returns(bool){
    	require(learnToken.balanceOf(msg.sender) > orgRegistrationFee, "You need 50 Learn tokens for registering");
    	learnToken.transferFrom(msg.sender, address(this), orgRegistrationFee);
    	organizations[msg.sender].owner = msg.sender;
    	organizations[msg.sender].name = _name;
    	organizations[msg.sender].isActive = true;
        organizations[msg.sender].normalSubscriptionFee = normalSubFee;
        organizations[msg.sender].premiumSubscriptionFee = premiumSubFee;
        organizations[msg.sender].premiumSubscriptionTime = 300;
        organizations[msg.sender].normalSubscriptionTime = 120;
        return true;
    }


    function registerAsOrganization(string memory _name, uint normalSubFee, uint premiumSubFee, uint normalSubTime, uint premiumSubTime) public payable returns(bool){
    	require(learnToken.balanceOf(msg.sender) > orgRegistrationFee, "You need 50 Learn tokens for registering");
    	learnToken.transferFrom(msg.sender, address(this), orgRegistrationFee);
    	organizations[msg.sender].owner = msg.sender;
    	organizations[msg.sender].name = _name;
    	organizations[msg.sender].isActive = true;
        organizations[msg.sender].normalSubscriptionFee = normalSubFee;
        organizations[msg.sender].premiumSubscriptionFee = premiumSubFee;
        organizations[msg.sender].premiumSubscriptionTime = premiumSubTime;
        organizations[msg.sender].normalSubscriptionTime = normalSubTime;
        return true;
    }


    function setOrChangeSubscriptionFee(address _org_address, uint _normalSubFee) public onlyOrganization(_org_address){
    	organizations[_org_address].normalSubscriptionFee = _normalSubFee;
    }


    function setOrChangePremiumSubscriptionFee(address _org_address, uint _premiumSubFee) public onlyOrganization(_org_address){
    	require(msg.sender == organizations[_org_address].owner,"You are not the owner of the organization");
    	organizations[_org_address].premiumSubscriptionFee = _premiumSubFee;
    }


    function buyNormalSubsciption(address _org_address) public{
    	require(learnToken.balanceOf(msg.sender) > organizations[_org_address].normalSubscriptionFee,"You do nor have sufficient learn tokens");
    	learnToken.transferFrom(msg.sender, address(this), organizations[_org_address].normalSubscriptionFee);
    	organizations[_org_address].userSubscriptionTimes[msg.sender] = block.timestamp + organizations[_org_address].normalSubscriptionTime ;
    }


    function buyPremiumSubscription(address _org_address) public{
    	require(learnToken.balanceOf(msg.sender) > organizations[_org_address].premiumSubscriptionFee,"You do nor have sufficient learn tokens");
    	learnToken.transferFrom(msg.sender, address(this), organizations[_org_address].premiumSubscriptionFee);
    	organizations[_org_address].userSubscriptionTimes[msg.sender] = block.timestamp + organizations[_org_address].premiumSubscriptionTime;
    }


    function purchaseTokens() public payable{
    	require(msg.value > 0,"Zero eth not allowed");
    	//learnToken.approve(msg.sender, msg.value);
    	learnToken.mint(msg.sender, msg.value);
    }


    function doesUserHasNormalAccess(address _org_address) public view returns(bool){
    	if(organizations[_org_address].userSubscriptionTimes[msg.sender] > block.timestamp){
            return true;
        } 
        else{
            return false;
        }
    }

    function doesUserHasPremiumAccess(address _org_address)public view returns(bool){
    	if(organizations[_org_address].userPremiumSubscriptionTimes[msg.sender] > block.timestamp){
           return true;
        }
        else{
           return false;
        }
    }
    
    function getUserEndSubscriptionTime(address _org_address) public view returns(uint){
        return organizations[_org_address].userSubscriptionTimes[msg.sender];
    }
    
    function getPremiumUserEndSubscriptionTime(address _org_address) public view returns(uint){
        return organizations[_org_address].userPremiumSubscriptionTimes[msg.sender];
    }
    
    function getOrganizationNormalFee(address _org_address) public view returns(uint){
        return organizations[_org_address].normalSubscriptionFee;
    }
    
    function getOrganizationPremiumFee(address _org_address) public view returns(uint){
        return organizations[_org_address].premiumSubscriptionFee;
    }
    
    function getOrganizationPremiumTime(address _org_address) public view returns(uint){
        return organizations[_org_address].premiumSubscriptionTime;
    }
    
    function getOrganizationNormalTime(address _org_address) public view returns(uint){
        return organizations[_org_address].normalSubscriptionTime;
    }
    
    
    function getCurrentTimeStamp() public view returns(uint){
        return block.timestamp;
    }
    
    
    function getOrganizationName(address _org_address) public view returns(string memory){
        return organizations[_org_address].name;
    }








    

}


