import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import PrivateRoute from '../private-route/private-route';
import {BaseOffer, City} from '../../lib/types/offer';
import {AppRoute, CITY, DEFAULT_CITY} from '../../const';
import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {useEffect} from 'react';
import {fillOffers, setCity} from '../../store/action';

type AppPageProps = {
  offers: BaseOffer[];
}

function App({ offers }: AppPageProps) {
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);
  const activeCity = useAppSelector((state) => state.city);
  const filteredOffers = useAppSelector((state) => state.filteredOffers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fillOffers(offers));
    dispatch(setCity(DEFAULT_CITY));
  }, [dispatch, offers]);

  const handleCityClick = (city: City) => {
    dispatch(setCity(city));
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path={AppRoute.Root}
            element={
              <MainPage
                offers={offers}
                cities={CITY}
                activeCity={activeCity}
                filteredOffers={filteredOffers}
                onCityClick={handleCityClick}
              />
            }
          />
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute>
                <FavoritesPage favorites={favoriteOffers} />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.Offer}
            element={<OfferPage />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
