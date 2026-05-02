import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import type { Point } from "../types/types";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { apiInstance } from "../api/api";
import { setCurrentStep } from "../redux/features/pathSlice";
import cn from 'classnames'

export const StepCard = () => {
  const path = useSelector((state: RootState) => state.pathReducer.currentPath)
  const step = useSelector((state: RootState) => state.pathReducer.currentStep)
  const dispatch = useDispatch()

  const [currentPoint, setCurrentPoint] = useState<Point | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const getCurrentPointHandler = async (pointId: string) => {
    try {
      const res = await apiInstance.get(`/points/${pointId}`)

      const dataUrl = res.data.photo_base64 ? `data:image/png;base64,${res.data.photo_base64}` : ''
      
      setCurrentPoint({
        id: res.data.point.id,
        description: res.data.point.description,
        nums: res.data.point.nums,
        tags: res.data.point.tags,
        photo: res.data.point.photo,
        photoBase64: dataUrl
      })
    } catch (error) {
      console.error('Ошибка при загрузке фото точки:', error)
      // Set point without photo if error
      if (path.length > 0) {
        setCurrentPoint(path[step - 1])
      }
    }
  }

  const handleNextStep = useCallback(() => {
    if (step < path.length) {
      dispatch(setCurrentStep(step + 1));
    }
  }, [step, path.length, dispatch]);

  const handlePrevStep = useCallback(() => {
    if (step > 1) {
      dispatch(setCurrentStep(step - 1));
    }
  }, [step, dispatch]);

  useEffect(() => {
    if (path.length > 0) {
      getCurrentPointHandler(path[step-1].id)
    }
    
  }, [step, path])

  useEffect(() => {
    const handleEscClose = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsImageModalOpen(false)
      }
    }

    if (isImageModalOpen) {
      window.addEventListener("keydown", handleEscClose)
    }

    return () => {
      window.removeEventListener("keydown", handleEscClose)
    }
  }, [isImageModalOpen])

  useEffect(() => {
    if (!isImageModalOpen) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [isImageModalOpen])

  return (
    <section className={cn("step-card", { "step-card--empty": path.length === 0 })} aria-labelledby="step-title">
      {
        path.length == 0 ? (
          <div className="step-card__empty">
            <h2 className="step-card__title" id="step-title">Маршрут не проложен</h2>
            <p className="step-card__empty-subtitle">Выберите отправную и конечную точки в форме выше, чтобы построить путь.</p>
          </div>
        ) : (
          <>
            <h2 className="step-card__title" id="step-title">Текущий шаг</h2>
            <figure className="step-card__figure">
              {currentPoint?.photoBase64 && (
                <img
                  className="step-card__image"
                  src={currentPoint.photoBase64}
                  alt={`Точка маршрута: ${currentPoint.description}`}
                  onClick={() => setIsImageModalOpen(true)}
                />
              )}
            </figure>
            <section className="step-card__details" aria-label="Данные точки">
              <article className="step-card__detail">
                <h3 className="step-card__detail-title">Описание</h3>
                <p className="step-card__detail-text">{path[step - 1].description}</p>
              </article>
              <article className="step-card__detail">
                <h3 className="step-card__detail-title">Теги</h3>
                {
                  currentPoint?.tags && currentPoint?.tags.length > 0 ? (
                    <div className="step-card__chips" aria-label="Теги точки">
                      {currentPoint?.tags.map((tag, idx) => <span key={`tag-${idx}-${tag}`} className="step-card__chip">{tag}</span>)}
                    </div>
                  ) : (
                    <p className="step-card__detail-text step-card__detail-text--muted">Теги отсутствуют</p>
                  )
                }
              </article>
              <article className="step-card__detail">
                <h3 className="step-card__detail-title">Аудитории поблизости</h3>
                {
                  currentPoint?.nums && currentPoint?.nums.length > 0 ? (
                    <div className="step-card__chips" aria-label="Аудитории поблизости">
                      {currentPoint?.nums.map((cabinet, idx) => <span key={`cabinet-${idx}-${cabinet}`} className="step-card__chip step-card__chip--accent">{cabinet}</span>)}
                    </div>
                  ) : (
                    <p className="step-card__detail-text step-card__detail-text--muted">Нет данных об аудиториях</p>
                  )
                }
              </article>
            </section>
            <ol className="step-card__list" aria-label="Пошаговый маршрут">
              {
                path.map((point, idx) => {
                  return <li key={`step-${point.id}-${idx}`} className={cn('step-card__item step-card__item', {'step-card__item step-card__item--active': idx+1 == step}, {'step-card__item step-card__item--done': idx+1 < step})}>{point.description}</li>
                })
              }
            </ol>
            <div className="step-card__controls">
              <button
                className="step-card__btn step-card__btn--prev"
                onClick={handlePrevStep}
                disabled={step === 1}
                aria-label="Предыдущий шаг"
              >
                ← Назад
              </button>
              <button
                className="step-card__btn step-card__btn--next"
                onClick={handleNextStep}
                disabled={step === path.length}
                aria-label="Следующий шаг"
              >
                Далее →
              </button>
            </div>
            {isImageModalOpen && currentPoint?.photoBase64 && typeof document !== "undefined" && createPortal(
                <div className="step-card__modal" role="dialog" aria-modal="true" aria-labelledby="step-image-title" onClick={() => setIsImageModalOpen(false)}>
                  <div className="step-card__modal-shell" onClick={(e) => e.stopPropagation()}>
                    <header className="step-card__modal-header">
                      <div className="step-card__modal-meta">
                        <p className="step-card__modal-kicker">Шаг {step} из {path.length}</p>
                        <h3 className="step-card__modal-title" id="step-image-title">Полное изображение точки</h3>
                      </div>
                      <button
                        className="step-card__modal-close"
                        type="button"
                        onClick={() => setIsImageModalOpen(false)}
                        aria-label="Закрыть полноэкранное изображение"
                      >
                        Закрыть
                      </button>
                    </header>
                    <div className="step-card__modal-body">
                      <img
                        className="step-card__modal-image"
                        src={currentPoint.photoBase64}
                        alt={`Полное изображение: ${currentPoint.description}`}
                      />
                    </div>
                    <footer className="step-card__modal-footer">
                      <p className="step-card__modal-caption">{currentPoint.description}</p>
                      <p className="step-card__modal-hint">Нажмите Esc или кнопку Закрыть</p>
                    </footer>
                  </div>
                </div>,
                document.body
              )}
          </>
        )
      }
    </section>
  );
};
