import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useParams} from 'react-router-dom';
import CommentForm from '../../components/comment-form/comment-form';
import ReviewList from '../../components/review-list/review-list';
import Map from '../../components/map/map';
import NearOfferList from '../../components/near-offer-list/near-offer-list';
import OfferGallery from '../../components/offer-gallery/offer-gallery';
import OfferFeatures from '../../components/offer-features/offer-features';
import OfferInsideList from '../../components/offer-inside-list/offer-inside-list';
import Spinner from '../../components/spinner/spinner';
import NotFoundPage from '../not-found-page/not-found-page';
import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {RootState} from '../../store';
import {fetchOfferById, fetchNearbyOffers, fetchComments} from '../../store/offer-slice';
import {NEARBY_OFFERS_COUNT, RequestStatus} from '../../const';
import {BaseOffer} from '../../lib/types/offer';
import FavoritesButton from '../../components/favorites-button/favorites-button';

function OfferPage() {
  const {id} = useParams<{id: string}>();
  const dispatch = useAppDispatch();
  const {offer, nearbyOffers, comments, status} = useAppSelector((state: RootState) => state.offer);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferById(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  const filteredNearbyOffers = nearbyOffers.slice(0, NEARBY_OFFERS_COUNT);

  const combinedOffers: BaseOffer[] = offer ? [offer, ...filteredNearbyOffers] : filteredNearbyOffers;

  if (status === RequestStatus.Loading) {
    return <Spinner loading error={false} />;
  }

  if (status === RequestStatus.Failed || (status === RequestStatus.Success && !offer)) {
    return <NotFoundPage />;
  }

  if (!offer) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>6 cities: offer</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <OfferGallery images={offer.images} />
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <FavoritesButton
                  offerId={offer.id}
                  isFavorite={offer.isFavorite}
                  buttonClassName="offer__bookmark-button"
                  iconClassName="offer__bookmark-icon"
                  iconWidth="31"
                  iconHeight="33"
                />
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${offer.rating * 20}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <OfferFeatures
                type={offer.type}
                bedrooms={offer.bedrooms}
                maxAdults={offer.maxAdults}
              />
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <OfferInsideList goods={offer.goods} />
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  <span className="offer__user-status">{offer.host.isPro ? 'Pro' : ''}</span>
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewList reviews={comments} />
                {id && <CommentForm offerId={id} />}
              </section>
            </div>
          </div>
          <section className="offer__map map">
            <Map city={offer.city} offers={combinedOffers} activeOfferId={offer.id} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <NearOfferList offers={filteredNearbyOffers} />
          </section>
        </div>
      </main>
    </>
  );
}

export default OfferPage;
