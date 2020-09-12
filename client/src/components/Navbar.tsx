import React from "react"
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { BsBootstrap, BsStar, BsClipboardData } from "react-icons/bs"
import {
  AiOutlineHome,
  AiOutlinePlusSquare,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineLogin,
  AiOutlineMenu,
} from "react-icons/ai"
import { BiBuildingHouse } from "react-icons/bi"
import { FiShoppingCart } from "react-icons/fi"
import {
  TOGGLE_DROP_MENU,
  RESET_MENU,
  TOGGLE_MAIN_MENU,
} from "../redux/menu/menuTypes"
import { RESET_AUTH } from "../redux/auth/authTypes"

const Navbar: React.FC = () => {
  const {
    auth: { userData },
    menu: { drop, dropMenu },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  const handleDrop = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    dispatch({ type: TOGGLE_DROP_MENU })
  }

  const handleLogOut = () => {
    dispatch({ type: RESET_AUTH })
  }

  return (
    <div className='nav'>
      <div className='nav__menu'>
        <NavLink to='/' className='link link__logo'>
          <BsBootstrap className='link__icon' />
          <span className='link__name'>Booking-Flat</span>
        </NavLink>

        <div
          className={`nav__drop-menu ${dropMenu && "nav__drop-menu--drop"}`}
          onClick={() => dispatch({ type: RESET_MENU })}
        >
          <NavLink exact to='/' className='link' activeClassName='link--active'>
            <AiOutlineHome className='link__icon' />
            <span className='link__name'>Home</span>
          </NavLink>
          <NavLink
            to='/filter?type=flats'
            className='link'
            activeClassName='link--active'
          >
            <BiBuildingHouse className='link__icon' />
            <span className='link__name'>Flats</span>
          </NavLink>
          <NavLink to='/cart' className='link' activeClassName='link--active'>
            <FiShoppingCart className='link__icon' />
            <span className='link__name'>Cart</span>
          </NavLink>
          {userData.user && userData.user.typeUser === "admin" && (
            <>
              <NavLink
                to='/find-buyer'
                className='link'
                activeClassName='link--active'
              >
                <AiOutlineSearch className='link__icon' />
                <span className='link__name'>Find</span>
              </NavLink>
              <NavLink
                to='/report'
                className='link'
                activeClassName='link--active'
              >
                <BsClipboardData className='link__icon' />
                <span className='link__name'>Report</span>
              </NavLink>
            </>
          )}
          {userData.token ? (
            <>
              <NavLink
                to='/orders'
                className='link'
                activeClassName='link--active'
              >
                <BsStar className='link__icon' />
                <span className='link__name'>Orders</span>
              </NavLink>
              <NavLink
                to='/create-flat'
                className='link'
                activeClassName='link--active'
              >
                <AiOutlinePlusSquare className='link__icon' />
                <span className='link__name'>Create</span>
              </NavLink>
              <div className='drop-menu'>
                <button
                  className={`drop-menu__btn link ${
                    drop && "drop-menu__btn--open"
                  }`}
                  onClick={handleDrop}
                >
                  <span className='drop-menu__container-img'>
                    <img
                      className='drop-menu__img'
                      src={userData.user.ava}
                      alt='userAva'
                    />
                  </span>
                  <span className='drop-menu__name link__name'>
                    {userData.user.firstname[0] + userData.user.lastname[0]}
                  </span>
                </button>
                <div
                  className={`drop-menu__container ${
                    drop && "drop-menu__container--active"
                  }`}
                >
                  <NavLink
                    to={`/user/${userData.user._id}`}
                    className='link'
                    activeClassName='link--active'
                  >
                    <AiOutlineUser className='link__icon' />
                    <span className='link__name'>Profile</span>
                  </NavLink>
                  <button className='link' onClick={handleLogOut}>
                    <AiOutlineLogout className='link__icon' />
                    <span className='link__name'>Log out</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <NavLink to='/auth' className='link' activeClassName='link--active'>
              <AiOutlineLogin className='link__icon' />
              <span className='link__name'>Sign up</span>
            </NavLink>
          )}
        </div>
        <button
          className={`nav__btn-menu btn ${dropMenu && "drop-menu__btn--open"}`}
          onClick={() => dispatch({ type: TOGGLE_MAIN_MENU })}
        >
          <AiOutlineMenu />
        </button>
      </div>
    </div>
  )
}

export default Navbar
