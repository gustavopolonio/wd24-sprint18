export default function Popup(props) {
  //children is the content of the popup
  const { title, children, onClose } = props;

  return (
    <div className='popup'>
      <div className={`popup__content ${!title ? 'popup__content_content_image' : ''}`}>
        <button aria-label='Close modal' className='popup__close' type='button' onClick={onClose} />

        {title && <h3 className='popup__title'>{title}</h3>}

        {children}
      </div>
    </div>
  );
}
