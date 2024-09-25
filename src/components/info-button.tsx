"use client";
import Info from "./info";

export default function InfoButton() {
  return (
    <>
      <button
        className="btn btn-info"
        onClick={() =>
          (
            document.getElementById("info_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        使い方
      </button>
      
      <dialog id="info_modal" className="modal">
        <div className="modal-box">
          <Info />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">閉じる</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
