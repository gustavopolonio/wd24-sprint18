export default function InfoTooltip({ imageSrc, message }) {
  return (
    <div className='popup__tooltip'>
      <img className='popup__tooltip-image' src={imageSrc} alt={message} />
      <p className='popup__tooltip-text'>{message}</p>
    </div>
  );
}
