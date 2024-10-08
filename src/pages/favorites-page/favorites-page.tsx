import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';
import {groupFavorites} from './utils';
import {useAppSelector} from '../../hooks/redux-hooks';
import FavoritesButton from '../../components/favorites-button/favorites-button';

function FavoritesPage() {
  const favorites = useAppSelector((state) => state.offers.favorites);
  const groupedFavorites = groupFavorites(favorites);

  const isEmpty = Object.keys(groupedFavorites).length === 0;

  return (
    <>
      <Helmet>
        <title>6 cities: favorites</title>
      </Helmet>

      <main className={`page__main page__main--favorites${isEmpty ? ' page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          {isEmpty ? (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            </section>
          ) : (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(groupedFavorites).map(([city, offers]) => (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to="/">
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {offers.map((offer) => (
                        <article className="favorites__card place-card" key={offer.id}>
                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <Link to={`/offer/${offer.id}`}>
                              <img className="place-card__image" src={offer.previewImage} width="150" height="110" alt="Place image" />
                            </Link>
                          </div>
                          <div className="favorites__card-info place-card__info">
                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">&euro;{offer.price}</b>
                                <span className="place-card__price-text">&#47;&nbsp;night</span>
                              </div>
                              <FavoritesButton
                                offerId={offer.id}
                                isFavorite={offer.isFavorite}
                                buttonClassName="place-card__bookmark-button"
                                iconClassName="place-card__bookmark-icon"
                                iconWidth="18"
                                iconHeight="19"
                              />
                            </div>
                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{ width: `${offer.rating * 20}%` }}></span>
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>
                            <h2 className="place-card__name">
                              <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                            </h2>
                            <p className="place-card__type">{offer.type}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33"/>
        </Link>
      </footer>
    </>
  );
}

export default FavoritesPage;
