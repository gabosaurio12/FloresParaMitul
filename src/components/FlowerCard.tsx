import type { Flower } from "../data/flowers";

interface FlowerCardProps {
    flower: Flower;
    selected: boolean;
    onSelect: () => void;
}

function FlowerCard({
    flower,
    selected,
    onSelect,
}: FlowerCardProps) {
    return (
        <button
            className={`flower-card ${selected ? "selected" : ""}`}
            onClick={onSelect}
            type="button"
        >
            <div className="flower-image-container">
                <img
                    src={flower.image}
                    alt={flower.name}
                    className="flower-image"
                />
            </div>

            <span className="flower-name">
                {flower.name}
            </span>
        </button>
    );
}

export default FlowerCard;