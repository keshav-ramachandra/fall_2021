import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
//import controller from '../controller'
import web3 from './../web3'
import {controller, tcontroller} from '../controller'
import {store} from '../../app/store'





export const getCurrentOrg = createAsyncThunk('Org/getCurrentOrg', async () => {
  const acts = await web3.eth.getAccounts(); 
  return { currentOrg: acts[0]};
})

export const updateStats = createAsyncThunk('Org/updateStats', async (data) => {

     let act = await web3.eth.getAccounts();

     let balance = await tcontroller.methods.balanceOf(act[0]).call();

     
     //let own = await store.getState().owner
     //console.log("ownnene", own)
     let naccess = await controller.methods.doesUserHasNormalAccess(localStorage.getItem("owner")).call({from:act[0]})
     
     let paccess = await controller.methods.doesUserHasPremiumAccess(localStorage.getItem("owner")).call({from:act[0]})

     if(naccess == true){
       naccess='Yes'
     }
     else{
      naccess='No'
     }

     if(paccess == true){
       paccess='Yes'
     }
     else{
      paccess='No'
     }
     return { currentOrg: act[0],balance : balance , paccess: paccess, naccess: naccess}


})


export const registerAsOrganization = createAsyncThunk('Org/registerAsOrganizaton', async (data) => {
     
     let act = await web3.eth.getAccounts();

     await controller.methods.registerAsOrganization(data.name,parseInt(data.normalSubFee), parseInt(data.premiumSubFee)).send({from:act[0]});
     

     return {premiumSubFee: data.premiumSubFee, normalSubFee: data.normalSubFee, name: data.name, owner : act[0]}
})


export const purchaseTokens = createAsyncThunk('Org/purchaseTokens', async (data) => {
     let act = await web3.eth.getAccounts();
     await controller.methods.purchaseTokens().send({from:act[0], value: data.value});
     let balance = await tcontroller.methods.balanceOf(act[0]).call();
     console.log(balance);
     return {balance:balance}
})

export const getTokenBalance = createAsyncThunk('Org/getTokenBalance', async () => {
     let act = await web3.eth.getAccounts();
     console.log("methods", tcontroller.methods)
     let balance = await tcontroller.methods.balanceOf(act[0]).call();

     console.log("l balance is ", balance)
     return { balance : balance }
})

export const purchaseNormalSubscription = createAsyncThunk('Org/purchaseNormalSubscription', async (data) => {
        let act = await web3.eth.getAccounts();
        await controller.methods.buyNormalSubsciption(data.owner).send({from:act[0] });
        let naccess = await controller.methods.doesUserHasNormalAccess(data.owner).call({from:act[0]})
        let balance = await tcontroller.methods.balanceOf(act[0]).call();
         if(naccess == true){
             naccess='Yes'
         }
         else{
             naccess='No'
         }
        return { naccess : naccess, balance: balance }
})


export const purchasePremiumSubscription = createAsyncThunk('Org/purchasePremiumSubscription', async (data) => {
        let act = await web3.eth.getAccounts();
        await controller.methods.buyPremiumSubscription(data.owner).send({from:act[0] });
        let paccess = await controller.methods.doesUserHasPremiumAccess(data.owner).call({from:act[0]})
        let balance = await tcontroller.methods.balanceOf(act[0]).call();
        if(paccess == true){
            paccess='Yes'
        }
        else{
            paccess='No'
        }
        return { paccess : paccess, balance: balance }        
})





/*
export const loadSelectElements = createAsyncThunk('node/loadSelectElements', async () => {
  const response = await controller.methods.nodeCount().call();
  const options = [];
  for(var i=0;i < response;i++){
      options.push({ value: i, label: i })
  }
  return options;
})

export const getBalanceAsync = createAsyncThunk('node/getBalanceAsync', async (_nodeId) => {
  const response = await controller.methods.getCumulativeNodeDeposit(_nodeId).call();
  return response;
})

export const updateCurrentNodeAsync = createAsyncThunk('node/updateCurrentNodeAsync', async (_nodeId) => {
  return parseInt(_nodeId);
})


export const stakeRenAsync = createAsyncThunk('node/stakeRenAsync', async (data) => {
  //const {_amount,_nodeId,_sender}= data;
  await controller.methods.stakeRen(parseInt(data.incrementAmount),parseInt(data.currentNode)).send({from:data.user});

  
  const nodeBalance = await controller.methods.getCumulativeNodeDeposit(data.currentNode).call();
  let status
  if(parseInt(nodeBalance) == 50000){
    status = 'full';
  }
  else{
    status = 'accepting';
  }

  

  const share = await controller.methods.getMyCumulativeNodeDeposit(parseInt(data.currentNode)).call({from:data.user});

  return {nodeId: data.currentNode, nodeBalance: nodeBalance, status: status, share:share}
})


export const createNodeAsync = createAsyncThunk('node/createNodeAsync', async (_user) => {
  const response = await controller.methods.createNode().send({from:_user});
  return response;
})

export const getNodeAsync = createAsyncThunk('node/getNodeAsync', async () => {
  const response = await controller.methods.nodeCount().call();
  return parseInt(response)-1;
})

export const getDepositStatusAsync = createAsyncThunk('node/getDepositStatusAsync',async() => {
  const currentNodeBalance = getBalanceAsync(getNodeAsync());
  if(parseInt(currentNodeBalance) == 50000){
    return 'full';
  }
  else{
    return 'accepting';
  }
})

export const updateNodeStats = createAsyncThunk('node/updateNodeStats', async (data) => {
  const response = await controller.methods.nodeCount().call();
  
  let nodeId 
  if(data._nodeId == -1){
    nodeId= parseInt(response) - 1;
  }
  else{
    nodeId = parseInt(data._nodeId)
  }
  const nodeBalance = await controller.methods.getCumulativeNodeDeposit(nodeId).call();
  let status
  if(parseInt(nodeBalance) == 50000){
    status = 'full';
  }
  else{
    status = 'accepting';
  }

  const acts = await web3.eth.getAccounts();
  console.log("user is", acts[0])


  const share = await controller.methods.getMyCumulativeNodeDeposit(nodeId).call({from:acts[0]});

  return {nodeId: nodeId, nodeBalance: nodeBalance, status: status,share:share}
})



export const isOwner = createAsyncThunk('node/isOwner', async (_user) => {
  const response = await controller.methods.owner().call();
  const acts = await web3.eth.getAccounts(); 

  if(response == acts[0]){
    return 'yes';
  }
  else{
    return 'no';
  }
  
})

*/


let initialState= {
      currentOrg: '',
      orgCreated: false,
      normalSubFee:0,
      premiumSubFee:0,
      normalSubTime:120,
      premiumSubTime:300,
      userTokenBalance:0,
      doesUserHasNormalAccess: 'No',
      doesUserHasPremiumAccess: 'No',
      orgName: '',
      orgOwner:'',
      isOwner:false
    }
const OrgSlice = createSlice({
    name:'org',
    initialState,
    
    reducers: {
      // omit existing reducers here
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder.addCase(getCurrentOrg.fulfilled, (state, action) => {
        // Add user to the state array
        state.currentOrg = action.payload.currentOrg
      })
      .addCase(registerAsOrganization.fulfilled, (state, action) => {
        // Add user to the state array
        state.orgName = action.payload.name
        state.normalSubFee = action.payload.normalSubFee
        state.premiumSubFee = action.payload.premiumSubFee
        state.orgCreated = true
        state.userTokenBalance = action.payload.balance
        console.log("now owner is", action.payload.owner)
        state.orgOwner = action.payload.owner
        localStorage.setItem("owner", action.payload.owner)
        state.isOwner = true
        state.currentOrg = action.payload.owner
      })
      .addCase(getTokenBalance.fulfilled, (state, action) => {
        // Add user to the state array
        state.userTokenBalance = action.payload.balance
      })
      .addCase(purchaseTokens.fulfilled, (state, action) => {
        // Add user to the state array
        state.userTokenBalance = action.payload.balance
      })
      .addCase(updateStats.fulfilled, (state, action) => {
        // Add user to the state array
        state.userTokenBalance = action.payload.balance
        state.currentOrg = action.payload.currentOrg
        if(localStorage.getItem("owner") != action.payload.currentOrg){
          state.isOwner= false
        }
        else{
          state.isOwner=true
        }
        state.doesUserHasNormalAccess = action.payload.naccess
        console.log("user access", action.payload.naccess)
        state.doesUserHasPremiumAccess = action.payload.paccess
        
      })
      .addCase(purchaseNormalSubscription.fulfilled, (state, action) => {
        // Add user to the state array
        state.userTokenBalance = action.payload.balance
        state.doesUserHasNormalAccess = action.payload.naccess
      })
      .addCase(purchasePremiumSubscription.fulfilled, (state, action) => {
        // Add user to the state array
        state.userTokenBalance = action.payload.balance
        state.doesUserHasPremiumAccess = action.payload.paccess
      })

      /*
      .addCase(getBalanceAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.balance = action.payload
      })
      .addCase(getNodeAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.currentNode = action.payload
      })
      .addCase(getDepositStatusAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.depositStatus = action.payload
      })
      .addCase(updateNodeStats.fulfilled, (state, action) => {
        // Add user to the state array
        state.depositStatus = action.payload.status
        state.balance = action.payload.nodeBalance
        state.currentNode = action.payload.nodeId
        state.share = action.payload.share
        state.status ='func'
      })
      .addCase(isOwner.fulfilled, (state, action) => {
        // Add user to the state array
        state.owner = action.payload
      })
      .addCase(loadSelectElements.fulfilled, (state, action) => {
        // Add user to the state array
        state.options = action.payload
      })
      .addCase(stakeRenAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.depositStatus = action.payload.status
        state.balance = action.payload.nodeBalance
        state.currentNode = action.payload.nodeId
        state.share = action.payload.share
        state.status ='func'
      })
      */
      
    }
})


  export default OrgSlice.reducer