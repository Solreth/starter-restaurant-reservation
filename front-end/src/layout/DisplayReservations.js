import React from "react";
import { Link } from "react-router-dom";
import { cancelReservation } from "../utils/api";

export default function DisplayReservations({
  reservations,
  setReservationsError,
}) {
  async function cancelHandler(event) {
    const abortController = new AbortController();
    const reservation_id = event.target.getAttribute(
      "data-reservation-id-cancel"
    );
    console.log("Fuck this", reservation_id);
    try {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        await cancelReservation(
          { status: "cancelled" },
          reservation_id,
          abortController.signal
        );
        window.location.reload();
        return () => abortController.abort();
      }
    } catch (error) {
      setReservationsError(error);
    }
  }
  // const finishHandler = async (tableId) => {
  //   if (
  //     window.confirm(
  //       "Is this table ready to seat new guests? This cannot be undone."
  //     )
  //   ) {
  //     await finishTable(tableId);
  //     loadDashboard();
  //   }
  // };
  const output = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <td>
          <div name="reservation_id">{reservation.reservation_id}</div>
        </td>
        <td>
          <div name="reservation_name">
            {reservation.first_name}&nbsp;{reservation.last_name}
          </div>
        </td>
        <td>
          <div name="reservation_phone">{reservation.mobile_number}</div>
        </td>
        <td>
          <div name="reservation_date">
            <p>{reservation.reservation_date}</p>
          </div>
        </td>
        <td>
          <div name="reservation_time">
            <p>{reservation.reservation_time}</p>
          </div>
        </td>
        <td>
          <div name="reservation_time">{reservation.people}</div>
        </td>
        <td>
          <div
            data-reservation-id-status={reservation.reservation_id}
            name="reservation_status"
          >
            {reservation.status}
          </div>
        </td>
        <td>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            name="Cancel"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </td>
        <td>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button name="Edit">Edit</button>
          </Link>
        </td>
        {reservation.status === "booked" && (
          <td>
            <Link to={`/reservations/${reservation.reservation_id}/seat`}>
              <button name="Seat">Seat</button>
            </Link>
          </td>
        )}
      </tr>
    );
  });
  return output;
}
