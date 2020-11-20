import React from 'react';
import './App.css';
import {BrowserRouter,Route,Link,NavLink,Switch,Redirect} from 'react-router-dom';
import {isEqual} from 'lodash';

const PostsList = ({data: postsList,onBack}) => {
    if (postsList === null) {
      return "...Loading..."
    } else {
      return (
        <>
        <button onClick={() => onBack()}
        >Back</button>
        <ul>
          {postsList.map((post) => (
            <li key={post.id}
            >
              {post.title}
            </li>
          ))}
        </ul>
        </>
      )
    }
}

const UsersList = ({data: usersList,onBack}) => {
  if (usersList === null) {
    return  "...Loading..."
    
  } else {
return (
  <>
  <button
  onClick={() => onBack()}
  >Back</button>
  <ul>
    {usersList.map((user) => (
      <li key={user.id} >
  
        <Link to={`/users/${user.id}`}> {user.name} </Link> 
      </li>
    ))}
  </ul>
  </>
)
}
}

class DataContainerWithElement extends React.Component {

  state = {
   data: null,
  }

  async  componentDidMount() {
   const response = await fetch(this.props.url);
   const data = await response.json();

   this.setState({
     data,
   })
 }

//  class DataContainer extends React.Component {

//    state = {
//     data: null,
//    }

//    async  componentDidMount() {
//     const response = await fetch(this.props.url);
//     const data = await response.json();

//     this.setState({
//       data,
//     })
//   }

  // async  componentDidUpdate(prevProps) {
  //   if (!(isEqual(prevProps,this.props))){
  //     this.setState({
  //       data: null,
  //     })

  //   const response = await fetch(this.props.url);
  //   const data = await response.json();

  //   this.setState({
  //     data,
  //   })
  // }
  // }

  render() {
      return (
        React.cloneElement(this.props.children, {data: this.state.data},
           )
      )
  }
  }

 class DataContainer extends React.Component {

   state = {
    data: null,
   }

   async  componentDidMount() {
    const response = await fetch(this.props.url);
    const data = await response.json();

    this.setState({
      data,
    })
  }

   render() {
    const {url, component: Component, ...other} = this.props;
      return (
        <Component 
        data = {this.state.data}
        {...other}
        />
      )
  }
  }

  const OneUser = ({data: user, color}) =>  {

    if (user === null) {
      return  "...Loading..."
      
    } else {
      return (
        <>
        <h1 style = {{backgroundColor: color}}
        >{user.name}</h1>
        <h2>Address:</h2>
        <p>
        Name: {user.name} <br/>
          Address: {user.address.city}, {user.address.street},
           {user.address.suite},
          zipcode: {user.address.zipcode}
        </p>
        </>
      )
    }
  }

class UsersApp extends React.Component {

  render() {
   return (
      <BrowserRouter>
      <p>
      <NavLink exact to="/posts" className="menu">Posts List</NavLink>
      </p>
      <p>
      <NavLink exact to="/users" className="menu">Users List</NavLink>
      </p>
      <Switch>
      {/* <Route exact path="/users"
      render={(args)=> (
        <DataContainer
        key = "users"
        url = 'https://jsonplaceholder.typicode.com/users' 
        onBack={() => args.history.push('/posts')}
        history={args.history}
        component = {UsersList}
        />
      )}
      >
      </Route> */}

<Route exact path="/users"
      render={(args)=> (
        <DataContainerWithElement
        key = "users"
        url = 'https://jsonplaceholder.typicode.com/users' 
       
        history={args.history}
        >
         <UsersList color= {"red"}
          onBack={() => args.history.push('/posts')}
         />
         </DataContainerWithElement>
      )}
      >
      </Route>

   
      <Route exact path="/">
        <Redirect to="/posts"/>
        </Route>
    <Route exact  path="/posts" 
    render={(args) => (
      <DataContainer 
      key = "posts"
      url = 'https://jsonplaceholder.typicode.com/posts'
      history={args.history}
      onBack={() => args.history.push('/users')}
      component = {PostsList}
      />
    )}
    >
      </Route>


  <Route path="/users/:id"
  render={(args) => (
    <DataContainer
    key = "user"
    component = {OneUser}
    color = "red"
    url = {`https://jsonplaceholder.typicode.com/users/${args.match.params.id}`}
    />
  )}
  />
    
      <Route>The page was not found</Route>
      </Switch>
      </BrowserRouter>
    )
  }
}

export default UsersApp;
