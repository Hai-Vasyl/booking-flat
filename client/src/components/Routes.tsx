import React from "react"
import Main from "../pages/Main"
import CreateEditFlat from "../pages/CreateEditFlat"
import CreateEditVoucher from "../pages/CreateEditVoucher"
import Auth from "../pages/Auth"
import DetailsFlat from "../pages/DetailsFlat"
import DetailsVoucher from "../pages/DetailsVoucher"
import OrderBookings from "../pages/OrderBookings"
import User from "../pages/User"
import Filter from "../pages/Filter"
import Navbar from "../components/Navbar"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"

const Routes: React.FC = () => {
  const {
    auth: { userData },
  } = useSelector((state: RootStore) => state)

  return (
    <Router>
      <Navbar />
      {userData.token ? (
        userData.user.typeUser === "admin" ? (
          <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/create-flat' component={CreateEditFlat} />
            <Route path='/create-voucher' component={CreateEditVoucher} />
            <Route path='/orders-vouchers' component={OrderBookings} />
            <Route exact path='/user' component={User} />

            <Route path='/filter/:filterString' component={Filter} />
            <Route path='/edit-flat/:flatId' component={CreateEditFlat} />
            <Route
              path='/edit-voucher/:voucherId'
              component={CreateEditVoucher}
            />
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
            <Route path='/create-voucher' component={CreateEditVoucher} />
            <Route path='/orders-vouchers' component={OrderBookings} />
            <Route exact path='/user' component={User} />

            <Route path='/filter/:filterString' component={Filter} />
            <Route path='/edit-flat/:flatId' component={CreateEditFlat} />
            <Route
              path='/edit-voucher/:voucherId'
              component={CreateEditVoucher}
            />
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
          <Route path='/orders-vouchers' component={OrderBookings} />
          <Route path='/auth' component={Auth} />

          <Route path='/filter/:filterString' component={Filter} />
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
