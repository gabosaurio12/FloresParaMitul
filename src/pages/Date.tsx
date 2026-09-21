import { useEffect, useRef, useState } from "react";

interface DateData {
    flower: string,
    date: string;
    customDate: string;
    timeOfDay: string;
    time: string;
    activity: string;
    favoriteFood: string;
    dislikedFood: string;
    favoritePlace: string;
    selectedPlan: string;
    thingsToAvoid: string;
    otherIdea: string;
    additionalMessage: string
}

interface DateProposalProps {
    selectedFlower: string | null;
    onComplete: (proposalData: DateData) => void;
}

function Date({ selectedFlower, onComplete }: DateProposalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customDate, setCustomDate] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [favoriteFood, setFavoriteFood] = useState("");
    const [dislikedFood, setDislikedFood] = useState("");
    const [favoritePlace, setFavoritePlace] = useState("");
    const [thingsToAvoid, setThingsToAvoid] = useState("");
    const [otherIdea, setOtherIdea] = useState("");
    const [additionalMessage, setAdditionalMessage] = useState("");

    const dislikedFoodref = useRef<HTMLDivElement | null>(null);
    const favoriteRestaurantRef = useRef<HTMLDivElement | null>(null);
    const favoritePlaceRef = useRef<HTMLDivElement | null>(null);
    const clockOptionsRef = useRef<HTMLDivElement | null>(null);
    const timeSectionRef = useRef<HTMLButtonElement | null>(null);
    const nextButtonRef = useRef<HTMLButtonElement | null>(null);

    const scrollToQuestion = (element: HTMLElement | null) => {
        if (!element) return;

        setTimeout(() => {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100);
    };

    const scrollToButton = (element: HTMLElement | null) => {
        if (!element) return;

        setTimeout(() => {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 100);
    };

    useEffect(() => {
        if (favoriteFood.trim() !== "") {
            scrollToQuestion(dislikedFoodref.current);
        }
    }, [favoriteFood]);

    useEffect(() => {
        if (favoriteFood.trim() !== "") {
            scrollToQuestion(favoriteRestaurantRef.current);
        }
    }, [dislikedFood]);

    useEffect(() => {
        if (selectedPlan === "Algún lugar que te guste mucho") {
            scrollToQuestion(favoritePlaceRef.current);
        }
    }, [selectedPlan]);

    useEffect(() => {
        if (selectedTime) {
            scrollToButton(nextButtonRef.current);
        }
    }, [selectedTime])

    useEffect(() => {
        const hasDate = 
            (selectedDate && selectedDate !== "Otra opción") ||
            (selectedDate === "Otra opción" && customDate !== "");

        if (hasDate) {
            scrollToQuestion(timeSectionRef.current);
        }
    }, [selectedDate, customDate]);

    useEffect(() => {
        if (selectedTimeOfDay) {
            scrollToQuestion(clockOptionsRef.current);
        }
    }, [selectedTimeOfDay]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentStep]);

    const proposalData : DateData = {
        flower: selectedFlower ?? "",
        date: selectedDate ?? "",
        customDate,
        timeOfDay: selectedTimeOfDay ?? "",
        time: selectedTime ?? "",
        activity: selectedActivity ?? "",
        favoriteFood,
        dislikedFood,
        favoritePlace,
        selectedPlan: selectedPlan ?? "",
        thingsToAvoid,
        otherIdea,
        additionalMessage,
    }


    const dates = [
        "Viernes 25",
        "Sábado 26",
        "Domingo 27",
        "Otra opción",
    ];

    const timesByPeriod: Record<string, string[]> = {
        Mañana: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
        Tarde: ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"],
        Noche: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"],
    };

    return (
        <main className="date-page">
            <section className="date-content">
                {currentStep === 1 && (
                    <>
                        <p className="date-intro">
                            Tenemos una cita pendiente 🤩
                        </p>

                        <h1>¿Cuándo te gustaría que nos viéramos?</h1>

                        <div className="date-options">
                            {dates.map((date) => (
                                <button
                                    key={date}
                                    type="button"
                                    className={selectedDate === date ? "selected" : ""}
                                    onClick={() => {
                                        setSelectedDate(date);

                                        if (date !== "Otra opción") {
                                            setCustomDate("");
                                        }
                                    }}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>

                        {selectedDate === "Otra opción" && (
                            <div className="custom-date">
                                <label htmlFor="custom-date">
                                    ¿Qué día te gustaría?
                                </label>

                                <input
                                    id="custom-date"
                                    type="date"
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                />
                            </div>
                        )}

                        {(selectedDate && selectedDate !== "Otra opción") ||
                            (selectedDate === "Otra opción" && customDate !== "") ? (
                            <section className="question-section" ref={timeSectionRef}>
                                <p className="question-label">
                                    ¿A qué hora te gustaría vernos?
                                </p>

                                <div className="time-options">
                                    {Object.keys(timesByPeriod).map((period) => (
                                        <button
                                            key={period}
                                            type="button"
                                            className={selectedTimeOfDay === period ? "selected" : ""}
                                            onClick={() => {
                                                setSelectedTimeOfDay(period);
                                                setSelectedTime(null);
                                            }}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>

                                {selectedTimeOfDay && (
                                    <div
                                        className="clock-options"
                                        ref={clockOptionsRef}
                                    >
                                        {timesByPeriod[selectedTimeOfDay].map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                className={`clock-card ${
                                                    selectedTime === time ? "selected" : ""
                                                }`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                <span>{time}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedTime && (
                                    <button
                                        ref={nextButtonRef}
                                        type="button"
                                        className="next-button"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Siguiente
                                    </button>
                                )}

                            </section>
                        ) : null}
                    </>
                )}

                {currentStep === 2 && (
                    <section className="activity-section">
                        <p className="date-intro">
                            Ya tenemos el cuándo 🤩
                        </p>

                        <h1>¿Qué te gustaría hacer?</h1>

                        <div className="activity-options">
                            <button
                                type="button"
                                className={selectedActivity === "Comer algo" ? "selected" : ""}
                                onClick={() => setSelectedActivity("Comer algo")}
                            >
                                Comer algo 🍣
                            </button>
                            
                            <button
                                type="button"
                                className={selectedActivity === "Hacer algo juntos" ? "selected" : ""}
                                onClick={() => setSelectedActivity("Hacer algo juntos")}
                            >
                                Hacer algo juntos 🏞️
                            </button>

                            <button
                                type="button"
                                className={selectedActivity === "Sorpréndeme" ? "selected" : ""}
                                onClick={() => setSelectedActivity("Sorpréndeme")}
                            >
                                Sorpréndeme 🎁
                            </button>

                            <button
                                type="button"
                                className={selectedActivity === "Tengo otra idea" ? "selected" : ""}
                                onClick={() => setSelectedActivity("Tengo otra idea")}
                            >
                                Tengo otra idea 💡
                            </button>

                        </div>

                        {selectedActivity === "Comer algo" && (
                            <div className="activity-question">
                                <p className="question-label">
                                    ¡Me encanta comer!
                                </p>

                                <label htmlFor="favorite-food">
                                    ¿Cuál es tu comida favorita?
                                </label>

                                <input 
                                    id="favorite-food"
                                    type="text"
                                    value={favoriteFood}
                                    onChange={(e) => setFavoriteFood(e.target.value)}
                                    placeholder="👀🤤"
                                />

                                {favoriteFood.trim() !== "" && (
                                    <div
                                        className="follow-up-question"
                                        ref={dislikedFoodref}
                                    >
                                        <label htmlFor="disliked-food">
                                            ¿Hay algo que no te guste?
                                        </label>

                                        <input 
                                            id="disliked-food"
                                            type="text"
                                            value={dislikedFood}
                                            onChange={(e) => setDislikedFood(e.target.value)}
                                            placeholder="Algo que prefieras evitar 🫢"
                                        />

                                    </div>
                                )}

                                {dislikedFood.trim() !== "" && (
                                    <div
                                        className="follow-up-question"
                                        ref={favoriteRestaurantRef}
                                    >
                                        <label htmlFor="favorite-restaurant">
                                            ¿Hay algún lugar donde te gustaría comer?
                                        </label>

                                        <input 
                                            id="favorite-restaurant"
                                            type="text"
                                            value={favoritePlace}
                                            onChange={(e) => setFavoritePlace(e.target.value)}
                                            placeholder="Un restaurante, un lugar que quieras probar 🤭"
                                        />
                                    </div>
                                )}

                                {favoriteFood.trim() !== "" && dislikedFood.trim() !== "" && (
                                    <button
                                        type="button"
                                        className="next-button"
                                        onClick={() => setCurrentStep(3)}
                                    >
                                        Siguiente
                                    </button>
                                )}

                            </div>
                        )}

                        {selectedActivity === "Hacer algo juntos" && (
                            <div className="activity-question" >
                                <p className="question-label">
                                    ¡Vamos a divertirnos!
                                </p>

                                <label>
                                    ¿Qué te gustaría hacer?
                                </label>

                                <div className="plan-options">
                                    <button
                                        type="button"
                                        className={selectedPlan === "Ir a la plaza" ? "selected" : ""}
                                        onClick={() => setSelectedPlan("Ir a la plaza")}
                                    >
                                        Ir a la plaza
                                    </button>

                                    <button
                                        type="button"
                                        className={selectedPlan === "Vagar por el centro" ? "selected" : ""}
                                        onClick={() => setSelectedPlan("Vagar por el centro")}
                                    >
                                        Vagar por el centro
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            selectedPlan === "Algún lugar que te guste mucho"
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedPlan("Algún lugar que te guste mucho")
                                        }
                                    >
                                        Algún lugar que te guste mucho
                                    </button>
                                </div>

                                {selectedPlan === "Algún lugar que te guste mucho" && (
                                    <div className="follow-up-question"
                                        ref={favoritePlaceRef}>

                                        <label htmlFor="favorite-place">
                                            ¿Cuál es? 🗺️👀
                                        </label>

                                        <input 
                                            id="favorite-place"
                                            type="text"
                                            value={favoritePlace}
                                            onChange={(e) => setFavoritePlace(e.target.value)}
                                            placeholder="¿A dónde te gustaría ir?"
                                        />

                                    </div>
                                )}

                                {selectedPlan &&
                                    (
                                        selectedPlan !== "Algún lugar que te guste mucho" ||
                                        favoritePlace.trim() !== ""
                                    ) && (
                                        <button
                                            type="button"
                                            className="next-button"
                                            onClick={() => setCurrentStep(3)}
                                        >
                                            Siguiente
                                        </button>
                                )}

                            </div>
                        )}

                        {selectedActivity === "Sorpréndeme" && (
                            <div className="activity-question">

                                <p className="question-label">
                                    ¡Con mucho gusto!
                                </p>

                                <label htmlFor="things-to-avoid">
                                    Solo necesito saber una cosa 😶‍🌫️
                                    <br />
                                    ¿Hay algo que definitivamente no te gustaría hacer?
                                </label>

                                <input 
                                    id="things-to-avoid"
                                    type="text"
                                    value={thingsToAvoid}
                                    onChange={(e) => setThingsToAvoid(e.target.value)}
                                    placeholder="¿Algo que ni por $10,000 harías? "
                                />

                                {thingsToAvoid.trim() !== "" && (
                                    <button
                                        type="button"
                                        className="next-button"
                                        onClick={() => setCurrentStep(3)}
                                    >
                                        Siguiente
                                    </button>
                                )}

                            </div>
                        )}

                        {selectedActivity === "Tengo otra idea" && (
                            <div className="activity-question">

                                <p className="question-label">
                                    ¡Cuéntamelo todo por favor!
                                </p>

                                <label htmlFor="other-idea">
                                    ¿Qué tienes en mente?
                                </label>

                                <input 
                                    id="other-idea"
                                    type="text"
                                    value={otherIdea}
                                    onChange={(e) => setOtherIdea(e.target.value)}
                                    placeholder="Tu idea... 💭"
                                />

                                {otherIdea.trim() !== "" && (
                                    <button
                                        type="button"
                                        className="next-button"
                                        onClick={() => setCurrentStep(3)}
                                    >
                                        Siguiente
                                    </button>
                                )}

                            </div>
                        )}

                    </section>
                )}

                {currentStep === 3 && (
                    <section className="summary-section">

                        <p className="summary-intro">
                            Tenemos una cita 🎊
                        </p>

                        <h1>
                            Revisemos el VAR (Referencia a Don Pool)
                        </h1>

                        <div className="summary-card">

                            <p>
                                <strong>📅 Día: </strong>
                                <span>
                                    {selectedDate === "Otra opción"
                                        ? customDate
                                        : selectedDate}
                                </span>
                            </p>

                            <p>
                                <strong>🕒 Hora: </strong>
                                <span>
                                    {selectedTime}
                                </span>
                            </p>
                            
                            <p>
                                <strong>🌃 Plan: </strong>
                                <span>
                                    {selectedActivity}
                                </span>
                            </p>

                        </div>

                        <p className="summary-question">
                            <br />
                            ¿Gustas agregar algo más?
                        </p>

                        <textarea 
                            value={additionalMessage}
                            onChange={(e) => setAdditionalMessage(e.target.value)}
                            placeholder="Algo que quieras decirme 😊"
                        />

                        <button
                            type="button"
                            className="next-button"
                            onClick={() => onComplete(proposalData)}
                        >
                            Aceptar
                        </button>
                    </section>
                )}
                
            </section>
        </main>
    );
}

export default Date;