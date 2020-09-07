import React from "react"
import { BsBootstrap, BsCardChecklist } from "react-icons/bs"
import { BiBuildingHouse } from "react-icons/bi"
import { Link } from "react-router-dom"

const Main = () => {
  return (
    <div className='main'>
      <div className='main__content'>
        <div className='main__info'>
          <h1 className='main__title'>
            <BsBootstrap className='main__icon' />
            <span className='main__name'>Booking-Flat</span>
          </h1>
          <p className='main__paragraph'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt
            harum suscipit unde, ut, facilis pariatur excepturi ducimus quis
            architecto aspernatur vero, quaerat obcaecati a totam tenetur illum
            fugiat natus. Ipsam.
          </p>
          <div className='main__btns'>
            <Link to='/filter/flats/all' className='main__btn btn btn-primary'>
              <BiBuildingHouse className='btn__icon' />
              <span className='btn__name'>Flats</span>
            </Link>
            <Link to='/filter/vouchers/all' className='btn btn-simple'>
              <BsCardChecklist className='btn__icon' />
              <span className='btn__name'>Vouchers</span>
            </Link>
          </div>
        </div>
      </div>
      <div className='main__bg-image'></div>
    </div>
  )
}

export default Main
