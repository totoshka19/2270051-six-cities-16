import {useState} from 'react';
import OfferCard from '../offer-card/offer-card';
import {BaseOffer} from '../../lib/types/offer';

type OfferListProps = {
  offers: BaseOffer[];
  onActiveOfferChange: (offerId: string | null) => void;
}

function OfferList({offers, onActiveOfferChange}: OfferListProps) {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const handleOfferSelect = (offerId: string | null) => {
    setActiveOfferId(offerId);
    onActiveOfferChange(offerId);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onSelect={handleOfferSelect}
          isActive={activeOfferId === offer.id}
        />
      ))}
    </div>
  );
}

export default OfferList;
