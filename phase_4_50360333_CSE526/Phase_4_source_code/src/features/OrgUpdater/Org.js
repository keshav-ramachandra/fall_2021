import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Row, Col } from 'react-bootstrap';
import web3 from './../web3'

import Select from 'react-select';
import {store} from '../../app/store'



import {
  getCurrentOrg,
  registerAsOrganization,
  getTokenBalance,
  purchaseTokens,
  updateStats,
  purchaseNormalSubscription,
  purchasePremiumSubscription
} from './OrgSlice';
import styles from './Org.module.css';

export function Org() {
  //const fetchStatus = useSelector(state => state.node.status)
  //const error = useSelector(state => state.node.error)
  
  





  const dispatch = useDispatch();
  //const user = useSelector(state => state.node.user);
  const currentOrg = useSelector(state => state.org.currentOrg);
  //const owner = useSelector(state => state.org.orgOwner);
  const [oowner, setOowner] = useState(localStorage.getItem('owner'));
  const isOwner = useSelector(state => state.org.isOwner);
  //const balance = useSelector(state => state.node.balance);

  //const [currentOrg, setCurrentOrg ] = useState('');

  //const [owner, setOwner ] = useState('');

  const userTokenBalance = useSelector(state => state.org.userTokenBalance); 

  const orgCreated = useSelector(state => state.org.orgCreated);
  
  const orgName = useSelector(state => state.org.orgName);

  const normalSubFee = useSelector(state => state.org.normalSubFee)

  const premiumSubFee = useSelector(state => state.org.premiumSubFee)

  const normalSubTime = useSelector(state => state.org.normalSubTime)

  const premiumSubTime = useSelector(state => state.org.premiumSubTime)

  const doesUserHasNormalAccess = useSelector(state => state.org.doesUserHasNormalAccess)

  const doesUserHasPremiumAccess = useSelector(state => state.org.doesUserHasPremiumAccess)

  const [userBalance, setUserBalance ] = useState('');
/*
  const [normalSubFee, setNormalSubFee ] = useState(0);
  const [premiumSubFee, setPremiumSubFee ] = useState(0);

  const [normalSubTime, setNormalSubTime ] = useState(0);
  const [premiumSubTime, setPremiumSubTime ] = useState(0);

*/
  const [ normalEndTime, setNormalEndTime ] = useState(0);
  const [ premiumEndTime, setPremiumEndTime ] = useState(0);

  //const [ doesUserHasNormalAccess, setDoesUserHasNormalAccess ] = useState(false);
  //const [ doesUserHasPremiumAccess, setDoesUserHasPremiumAccess ] = useState(false);



  const options = useSelector(state => state.org.options);
  //dispatch(getUserAsync());
  //const status = useSelector(state => state.node.status) 
  //const depositStatus = useSelector(state => state.node.depositStatus) 
  //const nodeBalance = useSelector(state => state.org.balance)
  //const owner = useSelector(state => state.org.owner)
  //const share = useSelector(state => state.org.share)

  const [selectedOption, setSelectedOption] = useState(null);
  const [premText, setPremText]= useState('Premium Authorization Needed')
  const [normalText, setNormalText] = useState('Normal Authorization Needed')

  /*
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log(selectedOption.value);
    dispatch(updateOrgStats({_orgId:parseInt(selectedOption.value)}))
     //this prints the selected option
  }
  */


 

   useEffect(() => {
     const interval = setInterval(() => {
        dispatch(updateStats({owner: localStorage.getItem("owner")}))
      
    }, 10000);
    return () => clearInterval(interval)
   }, []);


   

   useEffect(() => {

    if(doesUserHasNormalAccess == 'No' ){
       setNormalText('Normal Authorization needed')
    }
    else{
      setNormalText('Usual Content Revealed')
    }
      
   },[doesUserHasNormalAccess])

   useEffect(() => {
    if(doesUserHasPremiumAccess == 'No' ){
       setPremText('Premium Authorization needed')
    }
    else{
      setPremText('Premium Content Revealed')
    }  
   },[doesUserHasPremiumAccess])


   useEffect(() => {

      dispatch(getCurrentOrg())
      dispatch(getTokenBalance())
      //dispatch(updateNodeStats({_nodeId:-1}))
      //dispatch(loadSelectElements())



      async function listenMMAccount() {
        window.ethereum.on("accountsChanged", async function() {
          // Time to reload your interface with accounts[0]!
         const  accounts = await web3.eth.getAccounts();
          dispatch(getCurrentOrg())
          console.log("oooowner is ", localStorage.getItem("owner"));
          dispatch(updateStats({owner: localStorage.getItem("owner")}))
        });
      }
    listenMMAccount();
  
  }, [])



  const [forgName, setfOrgName] = useState('')
  const [fpremiumSubFee, setfPremiumSubFee] = useState(300)
  const [fnormalSubFee, setfNormalSubFee] = useState(100)
  const [purchaseAmount, setPurchaseAmount] = useState(0)
  const handlefNameChange = (e) => {
    setfOrgName(e.target.value);
  }

  const handleNSubFeeChange = (e) => {
    setfNormalSubFee(parseInt(e.target.value))
  }

  const handlePSubFeeChange = (e) => {
    setfPremiumSubFee(parseInt(e.target.value))
  }

  const handlePurchaseAmount = (e) => {
    setPurchaseAmount(e.target.value)
  }

  
  

 

  let bContent 

  //if not owner
  if(localStorage.getItem("owner") != currentOrg){
     bContent = <Container>
       <Row className={styles.but_ui}><button onClick= { () => dispatch(purchaseNormalSubscription({ owner: localStorage.getItem("owner") }))}>Buy Sub</button></Row>
     </Container>
  }
  else{
    bContent=''
  }


  let content 



  if(!orgCreated){
    //content = <Row className={styles.but_ui}><button onClick= { () => dispatch(registerAsOrganization({ name:"udemy" , normalSubFee: 15 , premiumSubFee : 30, user:user}))}>Create Org</button></Row>
    //content = <Row className={styles.but_ui}><button onClick= { () => dispatch(registerAsOrganization({ name:"udemy" , normalSubFee:15 , premiumSubFee:30, user:currentOrg}))}>Create Org</button></Row>
    content = 
        <Container >
        <br />
        <br />
        <br />
        <br />

      <Row style={{display: 'flex',  justifyContent:'center', paddingBottom: 30, paddingLeft:170}}><Col className={styles.attribute}>LRN Balance:</Col> <Col className={styles.attr_value} style={{ paddingRight:180 }}>{userTokenBalance}</Col></Row>
      

      <Row style={{display: 'flex',  justifyContent:'center'}}> <p> 1 LRN Token = 1 wei </p></Row>
      <Row className={styles.but_ui} style={{display: 'flex', paddingBottom:50}}><Col><input type="text" value={purchaseAmount} onChange={ handlePurchaseAmount}/></Col><Col><button onClick= { () => dispatch( purchaseTokens({value: purchaseAmount}) ) }>Purchase Tokens</button></Col></Row>


        <h4> Register an Organization </h4>
        
        <Row style={{display: 'flex',  justifyContent:'center', padding: 10, paddingLeft:110}}>
        <label>
          Organization Name:
          <input type="text" value={forgName} onChange={ handlefNameChange} style={{ marginLeft:90}}/>
        </label>
        </Row>
        <Row style={{display: 'flex',  justifyContent:'center', padding: 10, paddingLeft:90}}> 
        <label>
          Normal Sub Fee:
          <input type="text" value={fnormalSubFee} onChange={ handleNSubFeeChange} style={{ marginLeft:110}} />
        </label>
        </Row>
        <Row style={{display: 'flex',  justifyContent:'center', padding: 10, paddingLeft:90}}>
        <label>
          Premium Sub Fee:
          <input type="text" value={fpremiumSubFee} onChange={ handlePSubFeeChange} style={{ marginLeft:90}}/>
        </label>
        </Row>
        <Row className={styles.but_ui}><button onClick= { () => dispatch(registerAsOrganization({ name: forgName , normalSubFee: fnormalSubFee , premiumSubFee: fpremiumSubFee, user:currentOrg}))}>Create Org</button></Row>
        
    </Container>

    return(
     content
    )

  }




  else if (orgCreated && !isOwner){

    return (
       <Container className={styles.node}>

          

          <Row style={{display: 'flex',  justifyContent:'center', paddingBottom: 30, paddingLeft:170}}><Col className={styles.attribute}>LRN Balance:</Col> <Col className={styles.attr_value} style={{ paddingRight:180 }}>{userTokenBalance}</Col></Row>
      
          
          <Row style={{display: 'flex',  justifyContent:'center'}}> <p> 1 LRN Token = 1 wei </p></Row>
          <Row className={styles.but_ui} style={{display: 'flex', paddingBottom:50}}><Col><input type="text" value={purchaseAmount} onChange={ handlePurchaseAmount}/></Col><Col><button onClick= { () => dispatch( purchaseTokens({value: purchaseAmount}) ) }>Purchase Tokens</button></Col></Row>
          
           <Row><Col className={styles.attribute}> Normal Secret:</Col> <Col className={styles.attr_small}><p>{normalText}</p></Col></Row>

          <Row><Col className={styles.attribute}>Learn Token Balance:</Col> <Col className={styles.attr_value}>{userTokenBalance}</Col></Row>
          <Row><Col className={styles.attribute}>Organization owner:</Col> <Col className={styles.attr_small}>{localStorage.getItem("owner")}</Col></Row>
          <Row><Col className={styles.attribute}>User :</Col> <Col className={styles.attr_small}>{currentOrg}</Col></Row>
          <Row><Col className={styles.attribute}>Organization Name:</Col> <Col className={styles.attr_value}>{forgName}</Col></Row>
          <Row><Col className={styles.attribute}>Normal Sub Fee:</Col> <Col className={styles.attr_value}>{normalSubFee}</Col></Row>
          <Row><Col className={styles.attribute}>Premium Sub Fee:</Col> <Col className={styles.attr_value}>{premiumSubFee}</Col></Row>
          <Row><Col className={styles.attribute}>Normal Time Access per Sub:</Col> <Col className={styles.attr_value}>{normalSubTime}</Col></Row>
          <Row><Col className={styles.attribute}>Premium Time Access per Sub:</Col> <Col className={styles.attr_value}>{premiumSubTime}</Col></Row>

          {/*<Row><Col className={styles.attribute}>my Normal End Time:</Col> <Col className={styles.attr_value}>{normalEndTime} </Col></Row>
          <Row><Col className={styles.attribute}>my Premium End Time:</Col> <Col className={styles.attr_value}>{premiumEndTime}</Col></Row>*/}
          <Row><Col className={styles.attribute}>Normal Access ?</Col> <Col className={styles.attr_value}>{doesUserHasNormalAccess}</Col></Row>
          
          {bContent}
      </Container>

    )
  }


  else if(orgCreated && isOwner){
     return(
       <Container className={styles.node}>
         <Row style={{display: 'flex',  justifyContent:'center',alignItems: 'center', paddingTop:400}}><p> Org has been created. Switch account to purchase subscriptions</p></Row>
       </Container>
     )
  }

  else{

    return(
      <Container>
      </Container>
    )
  }
  


}
