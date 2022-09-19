# Redux

> Redux is our global state store in the Ranger Treejer.
>
> There is two type of modules: 
> > - regular module
> > - redux-fetch-state
> 
> Used tools:
> > - redux-saga
> > - redux-logger
> > - redux-persist
> > - redux-fetch-state
> > - redux-persist-transform-filter
>
> 
>
> Base files
> > [store](./store.ts): store and redux config
> >
> > [reducer](./reducer.ts): combine reducer
> >
> >  [saga](./saga.ts): root saga

## [Modules and Reducers](./modules)
 - auth
 - [contracts](./modules/contracts): save dai, ether, magic balances
 - [init](./modules/init): init application
 - [netInfo](./modules/netInfo): checking network connection and save it
 - [profile](./modules/profile): profile data
 - [settings](./modules/settings): language and useGSN
 - [userNonce](./modules/userNonce): get user magic token
 - [userSign](./modules/userSign): get user accessibility
 - [web3](./modules/web3): web3 and network config
