
interface ItemCardProp {
    type: string,
    title: string,
    icon: any,
    value: any,
    unit: string,
    lastTime?: string,
  }

export const ItemCard: React.FC<ItemCardProp> = ({
    type,
    title,
    icon,
    value,
    unit,
    lastTime = '',
}) => {

    return (
        <div className="summary-card">
          <div className="card-header">
            <div className={`card-icon ${type}-icon`}>
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span>{title}</span>
          </div>
          <div className="card-value">
            {value} <span className="card-unit">{unit}</span>
          </div>
          {type === 'feed' && <div className="last-time-label">
            마지막 수유: <span>{lastTime}</span>
          </div>}
        </div>
    );
}