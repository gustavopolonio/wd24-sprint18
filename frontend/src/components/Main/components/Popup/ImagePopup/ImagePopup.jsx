export default function ImagePopup(props) {
  const { card } = props;

  return (
    <div className='popup__content popup__content_content_image'>
      <img alt='' className='popup__image' src={card.link} />
      <p className='popup__caption'>{card.name}</p>
    </div>
  );
}
