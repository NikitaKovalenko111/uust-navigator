import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { fetchPoints, setPoints } from "../redux/features/pointSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useAppDispatch } from "../hooks";
import type { PointValue } from "../types/types";
import { fetchPath } from "../redux/features/pathSlice";

export const RouteSearch = () => {
    const [fromValue, setFromValue] = useState<PointValue>({
        id: "",
        value: ""
    })
    const [targetValue, setTargetValue] = useState<PointValue>({
        id: "",
        value: ""
    })
    const [formError, setFormError] = useState("")
    const [currentFocus, setCurrentFocus] = useState<"nothing" | "to" | "from">("nothing")

    const points = useSelector((state: RootState) => state.pointReducer.foundPoints)

    const dispatch = useAppDispatch()

    const fromValueHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormError("")
        setFromValue({
            id: "",
            value: e.target.value
        })
    }

    const targetValueHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormError("")
        setTargetValue({
            id: "",
            value: e.target.value
        })
    }
    
    const focusValueHandleChange = (state: "nothing" | "to" | "from") => {
        setCurrentFocus(state)
    }

    const findPointsHandler = async (fromValue: string, targetValue: string, currentFocus: "nothing" | "to" | "from") => {
        dispatch(fetchPoints(currentFocus == "from" ? fromValue : targetValue))
    }

    const getPathHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!fromValue.id || !targetValue.id) {
            setFormError("Выберите отправную/конечную точку")
            return
        }

        setFormError("")
        
        try {
            dispatch(fetchPath({
                startId: fromValue.id,
                endId: targetValue.id
            }))          
        } catch (error) {
            console.error('Ошибка при получении маршрута:', error)
        }
    }

    useEffect(() => {
        findPointsHandler(fromValue.value, targetValue.value, currentFocus)
    }, [fromValue, targetValue, currentFocus]) 

    return (
        <section className="route-search" aria-labelledby="route-search-title">
        <h1 className="route-search__title" id="route-search-title">Построить маршрут</h1>
        <form className="route-form" onSubmit={getPathHandler} autoComplete="off">
            <label className="route-form__field" htmlFor="from-point">
            <span className="route-form__label">Откуда</span>
            <input
                className="route-form__input"
                id="from-point"
                name="from"
                type="text"
                placeholder="Корпус 2, вход"
                value={fromValue.value}
                onChange={fromValueHandleChange}
                onFocus={() => {
                    focusValueHandleChange("from")
                }}
                onBlur={() => {
                    focusValueHandleChange("nothing")
                }}
            />
            {
                points.length > 0  && <ul className="route-form__suggestions" role="listbox" aria-label="Варианты точки назначения">
                {
                    points.map(p => {
                        return (
                            <li key={`from-${p.id}`} className="route-form__suggestion-item">
                                <button onClick={() => {
                                    setFormError("")
                                    setFromValue({
                                        id: p.id,
                                        value: p.description
                                    })
                                    dispatch(setPoints([]))
                                }} className="route-form__suggestion-btn" type="button">{p.description}</button>
                            </li>
                        )
                    })
                }
                </ul>
            }
            </label>

            <label className="route-form__field" htmlFor="to-point">
            <span className="route-form__label">Куда</span>
            <input
                className="route-form__input"
                id="to-point"
                name="to"
                type="text"
                placeholder="Библиотека, 7 корпус"
                value={targetValue.value}
                onChange={targetValueHandleChange}
                onFocus={() => {
                    focusValueHandleChange("to")
                }}
                onBlur={() => {
                    focusValueHandleChange("nothing")
                }}
            />
            {
                points.length > 0  && <ul className="route-form__suggestions" role="listbox" aria-label="Варианты точки назначения">
                {
                    points.map(p => {
                        return (
                            <li key={`to-${p.id}`} className="route-form__suggestion-item">
                                <button onClick={() => {
                                    setFormError("")
                                    setTargetValue({
                                        id: p.id,
                                        value: p.description
                                    })
                                    dispatch(setPoints([]))
                                }} className="route-form__suggestion-btn" type="button">{p.description}</button>
                            </li>
                        )
                    })
                }
                </ul>
            }
            </label>

            <button className="route-form__submit" type="submit">Проложить</button>
            {
                formError && <p className="route-form__error" role="alert">{formError}</p>
            }
        </form>
        </section>
    );
};
