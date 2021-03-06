import React from "react"
import Main from "../pages/Main"
import CreateEditFlat from "../pages/CreateEditFlat"
import CreateEditVoucher from "../pages/CreateEditVoucher"
import Auth from "../pages/Auth"
import DetailsFlat from "../pages/DetailsFlat"
import DetailsVoucher from "../pages/DetailsVoucher"
import Cart from "../pages/Cart"
import User from "../pages/User"
import Filter from "../pages/Filter"
import FindOrders from "../pages/FindOrders"
import ReportGeneration from "../pages/ReportGeneration"
import Navbar from "../components/Navbar"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { RESET_MENU } from "../redux/menu/menuTypes"

const Routes: React.FC = () => {
  const {
    auth: { userData },
    menu: { drop, popup, dropMenu },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  return (
    <Router>
      <Navbar />
      <div
        onClick={() => dispatch({ type: RESET_MENU })}
        className={`background-popup ${
          (drop || popup || dropMenu) && "background-popup--active"
        }`}
      ></div>
      {userData.token ? (
        userData.user.typeUser === "admin" ? (
          <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/create-flat' component={CreateEditFlat} />
            <Route path='/cart' component={Cart} />
            <Route path='/filter' component={Filter} />
            <Route path='/find-buyer' component={FindOrders} />
            <Route path='/orders' component={FindOrders} />
            <Route path='/report' component={ReportGeneration} />

            <Route path='/edit-flat/:flatId' component={CreateEditFlat} />
            <Route path='/create-voucher/:id' component={CreateEditVoucher} />
            <Route path='/edit-voucher/:id' component={CreateEditVoucher} />
            <Route path='/details/flat/:flatId' component={DetailsFlat} />
            <Route
              path='/details/voucher/:voucherId'
              component={DetailsVoucher}
            />
            <Route path='/user/:userId' component={User} />
            <Redirect to='/' />
          </Switch>
        ) : (
          <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/create-flat' component={CreateEditFlat} />
            <Route path='/cart' component={Cart} />
            <Route path='/filter' component={Filter} />
            <Route path='/orders' component={FindOrders} />

            <Route path='/edit-flat/:flatId' component={CreateEditFlat} />
            <Route path='/create-voucher/:id' component={CreateEditVoucher} />
            <Route path='/edit-voucher/:id' component={CreateEditVoucher} />
            <Route path='/details/flat/:flatId' component={DetailsFlat} />
            <Route
              path='/details/voucher/:voucherId'
              component={DetailsVoucher}
            />
            <Route path='/user/:userId' component={User} />
            <Redirect to='/' />
          </Switch>
        )
      ) : (
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/cart' component={Cart} />
          <Route path='/filter' component={Filter} />
          <Route path='/auth' component={Auth} />

          <Route path='/details/flat/:flatId' component={DetailsFlat} />
          <Route
            path='/details/voucher/:voucherId'
            component={DetailsVoucher}
          />
          <Route path='/user/:userId' component={User} />
          <Redirect to='/' />
        </Switch>
      )}
    </Router>
  )
}

export default Routes
