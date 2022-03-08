export default ({ isActive, niggaSvg, title, desctiption, onClickCallback }) => {
    return (
        <div
            className={`realtive mr-2 overflow-hidden rounded-xl cursor-pointer
                ${isActive
                    ? 'hover:bg-gradient-to-b from-gray-700 via-gray-900 to-black bg-gradient-to-bl'
                    : 'bg-gradient-to-tl from-gray-700 via-gray-900 to-black hover:bg-gradient-to-bl'}
                `}
            style={{ minWidth: '300px' }}
            onClick={onClickCallback}
        >
            <div
                className="nigga-card__image bg-slate-900 no-scrollbar overflow-hidden" // scroll
                dangerouslySetInnerHTML={{ __html: niggaSvg }}
                style={{ width: '300px', height: '300px' }}
            ></div>
            <div className="text-slate-400 p-2 px-3">
                <h4 className="font-bold text-xl mb-1">{title}</h4>
                <h5>{desctiption}</h5>
            </div>
        </div>
    );
}