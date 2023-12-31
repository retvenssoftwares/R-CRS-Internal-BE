const CallDetails = require("../../models/call_details"); // Import the Mongoose model
const guest_booking_collections = require("../../models/booking_model");
const moment = require("moment");
const employee_model = require("../../models/employee_model");
const { format, parseISO, parse } = require("date-fns");

module.exports.get_disposition = async (req, res) => {
  try {
    // Aggregate data to find the disposition(s) with the highest occurrence for each day
    const result = await CallDetails.aggregate([
      {
        $match: {
          "calls_details.call_date": { $exists: true },
          "calls_details.disposition": { $exists: true },
        },
      },
      {
        $unwind: "$calls_details", // Split the array into separate documents
      },
      {
        $group: {
          _id: {
            call_date: "$calls_details.call_date",
            disposition: "$calls_details.disposition",
          },
          count: { $sum: 1 }, // Count occurrences of each disposition for each day
        },
      },
      {
        $sort: { "_id.call_date": 1, count: -1 }, // Sort by date and count in descending order
      },
      {
        $group: {
          _id: "$_id.call_date", // Group by call_date
          topDisposition: { $first: "$_id.disposition" }, // Get the disposition with the highest count
          count: { $first: "$count" }, // Collect dispositions with the same highest count
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          call_date: "$_id", // Rename _id to call_date
          topDisposition: 1,
          count: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

///  get all type of call count

module.exports.get_calls = async (req, res) => {
  try {
    let totalOutboundCalls = 0;
    let totalCalls = 0;
    let totalInboundCallsThisMonth = 0;

    const allCalls = await CallDetails.find({});

    // Get the current date in "YYYY-MM-DD" format
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");

    // Get the start of the month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const formattedStartOfMonth = format(startOfMonth, "dd-MM-yyyy");

    allCalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.type === "inbound") {
          // Convert the call_date to a Date object

          // Check if the call date is within the current month
          if (
            callDetail.call_date >= formattedStartOfMonth &&
            callDetail.call_date <= formattedCurrentDate
          ) {
            totalInboundCallsThisMonth++;
          }
        } else if (callDetail.type === "outbound") {
          totalOutboundCalls++;
        }
        // Count the total number of calls
        totalCalls++;
      });
    });

    return res.status(200).json({
      totalCalls,
      totalInboundCallsThisMonth,
      totalOutboundCalls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// inbound and outbounds calls details
// Import the Guest model or replace it with your actual model import

module.exports.get_inbound_calls_and_outbounds_callDetails = async (
  req,
  res
) => {
  try {
    // Remove the $match stage to get all call_details
    const callsWithGuestDetails = await CallDetails.find({});

    if (callsWithGuestDetails.length === 0) {
      return res.status(404).json({ msg: `No calls found` });
    }

    const flattenedCallDetails=[]

    const from = req.query.from;
    const to = req.query.to;

    const shouldApplyFiltering = from === "null" && to === "null";

    if (shouldApplyFiltering == true) {
      for (const callDetail of callsWithGuestDetails) {
        // Iterate through the callDetails within each callDetail
        for (const call of callDetail.calls_details) {
          // Find the corresponding guestDetails based on the guest_id from the current call
            const guestDetails = await guest_booking_collections.findOne({
              guest_id: call.guest_id,
            });

            if (guestDetails) {
              call.guest_details = {
                // Include all existing guest_details properties
                guest_first_name: guestDetails.guest_first_name, // Include guest_first_name
                caller_id: guestDetails.guest_mobile_number,
              };
            }

            flattenedCallDetails.push({
              call,
              guest_details: call.guest_details,
            });
          
        }
      }
    } else {
      
      const dateFormat = "dd-MM-yyyy";
      const startDate = parse(from, dateFormat, new Date());
      const endDate = parse(to, dateFormat, new Date());
      const formattedStartDate = format(startDate, dateFormat);
      //console.log(formattedStartDate)
      const formattedEndDate = format(endDate, dateFormat);
      //console.log(formattedEndDate)

      for (const callDetail of callsWithGuestDetails) {
        // Iterate through the callDetails within each callDetail
        for (const call of callDetail.calls_details) {
          // Find the corresponding guestDetails based on the guest_id from the current call
          const callDate = parse(call.call_date, dateFormat, new Date());
          const formattedCallDate = format(callDate, dateFormat);

          if ((formattedCallDate >= formattedStartDate &&formattedCallDate <= formattedEndDate)) {
          
            const guestDetails = await guest_booking_collections.findOne({
              guest_id: call.guest_id,
            });

            if (guestDetails) {
              call.guest_details = {
                // Include all existing guest_details properties
                guest_first_name: guestDetails.guest_first_name, // Include guest_first_name
                caller_id: guestDetails.guest_mobile_number,
              };
            }

            flattenedCallDetails.push({
              call,
              guest_details: call.guest_details,
            });

            
          }
        }
      }
    }

    // Return the flattenedCallDetails array
    return res.status(200).json({ allCalls: flattenedCallDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// top five disposition
module.exports.getTop5Dispositions = async (req, res) => {
  try {
    const allCalls = await CallDetails.find({});
    const dispositionsMap = new Map();

    allCalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        const disposition = callDetail.disposition;

        if (disposition) {
          if (dispositionsMap.has(disposition)) {
            dispositionsMap.set(
              disposition,
              dispositionsMap.get(disposition) + 1
            );
          } else {
            dispositionsMap.set(disposition, 1);
          }
        }
      });
    });

    // Sort the dispositions by count in descending order
    const sortedDispositions = [...dispositionsMap.entries()].sort(
      (a, b) => b[1] - a[1]
    );

    // Take the top 5 dispositions
    const top5 = sortedDispositions
      .slice(0, 5)
      .map(([disposition, count]) => ({ disposition, count }));

    return res.status(200).json({ top5Dispositions: top5 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get total call in a week with higest disposition
module.exports.total_calls_in_week = async (req, res) => {
  try {
    // Parse the input date from the query parameter (assuming the date is in 'DD-MM-YYYY' format)
    const inputDate = req.query.inputDate;
    const momentInputDate = moment(inputDate, "DD-MM-YYYY"); // Parse the input date with the correct format

    const results = [];

    // Loop through each day within the last 7 days
    for (let i = 0; i < 7; i++) {
      const startDate = momentInputDate
        .clone()
        .subtract(i, "days")
        .startOf("day")
        .format("DD-MM-YYYY");
      const endDate = momentInputDate
        .clone()
        .subtract(i, "days")
        .endOf("day")
        .format("DD-MM-YYYY");

      // Aggregate to count calls within the date range
      const dispositionCounts = await CallDetails.aggregate([
        {
          $unwind: "$calls_details",
        },
        {
          $match: {
            "calls_details.call_date": {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$calls_details.disposition",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 }, // Sort by count in descending order
        },
        {
          $limit: 1, // Limit to the top disposition
        },
      ]);

      // Get the highest disposition name and count
      const highestDisposition =
        dispositionCounts.length > 0
          ? {
              disposition: dispositionCounts[0]._id,
              count: dispositionCounts[0].count,
            }
          : { disposition: "", count: 0 };

      // Aggregate to count total calls within the date range
      const callCount = await CallDetails.aggregate([
        {
          $unwind: "$calls_details",
        },
        {
          $match: {
            "calls_details.call_date": {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $count: "total",
        },
      ]);

      const totalRecords = callCount.length > 0 ? callCount[0].total : 0;

      results.push({ date: startDate, totalRecords, highestDisposition });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// call_summary

module.exports.get_calls_summary = async (req, res) => {
  try {
    const allCalls = await CallDetails.find({});
    const from = req.query.from;
    const to = req.query.to;
    const hotel_name = req.query.hotel_name;
    const disposition = req.query.disposition;
    const guestDetailsArray = [];

    // Check if any query parameters are provided
    const shouldApplyFiltering =
      from === "null" &&
      to === "null" &&
      hotel_name === "null" &&
      disposition === "null";

    if (shouldApplyFiltering === true) {
      // No query parameters provided, execute this block
      async function processCalls() {
        for (const call of allCalls) {
          for (const callDetail of call.calls_details) {
            const guest_data = await guest_booking_collections.findOne({
              guest_id: callDetail.guest_id,
            });
            const agent_model = await employee_model.findOne({
              agent_id: callDetail.agent_id,
            });

            if (guest_data || agent_model) {
              const Full_name = `${guest_data.guest_first_name} ${guest_data.guest_last_name}`;
              const agent_full_name = `${agent_model.first_name} ${agent_model.last_name}`;
              const guest_details = {
                guest_name: Full_name,
                guest_mobile: guest_data.guest_mobile_number,
                date: callDetail.call_date,
                agent_name: agent_full_name,
                disposition: callDetail.disposition,
                hotel_name: callDetail.hotel_name,
                guest_email: guest_data.guest_email,
                remark: callDetail.remark,
              };
              guestDetailsArray.push(guest_details);

              console.log(guestDetailsArray);
            }
          }
        }
      }

      await processCalls();

      if (guestDetailsArray.length === 0) {
        return res.status(500).json({ msg: "Data not found" });
      }

      return res.status(200).json({ guest_details: guestDetailsArray });
    } else {
      if (from === "null" && to === "null") {
        // Search for other filters when date parameters are not provided
        async function processCalls() {
          for (const call of allCalls) {
            for (const callDetail of call.calls_details) {
              if (
                callDetail.disposition === disposition ||
                callDetail.hotel_name === hotel_name
              ) {
                const guest_data = await guest_booking_collections.findOne({
                  guest_id: callDetail.guest_id,
                });
                const agent_model = await employee_model.findOne({
                  agent_id: callDetail.agent_id,
                });

                if (guest_data || agent_model) {
                  const Full_name = `${guest_data.guest_first_name} ${guest_data.guest_last_name}`;
                  const agent_full_name = `${agent_model.first_name} ${agent_model.last_name}`;
                  const guest_details = {
                    guest_name: Full_name,
                    guest_mobile: guest_data.guest_mobile_number,
                    date: callDetail.call_date,
                    agent_name: agent_full_name,
                    disposition: callDetail.disposition,
                    hotel_name: callDetail.hotel_name,
                    guest_email: guest_data.guest_email,
                    remark: callDetail.remark,
                  };
                  guestDetailsArray.push(guest_details);
                }
              }
            }
          }
        }

        await processCalls();

        if (guestDetailsArray.length === 0) {
          return res.status(404).json({ msg: "Data not found" });
        }

        return res.status(200).json({ guest_details: guestDetailsArray });
      } else {
        const dateFormat = "dd-MM-yyyy";
        const startDate = parse(from, dateFormat, new Date());
        const endDate = parse(to, dateFormat, new Date());
        const formattedStartDate = format(startDate, dateFormat);
        const formattedEndDate = format(endDate, dateFormat);

        async function processCalls() {
          for (const call of allCalls) {
            for (const callDetail of call.calls_details) {
              const callDate = parse(
                callDetail.call_date,
                dateFormat,
                new Date()
              );
              const formattedCallDate = format(callDate, dateFormat);

              if (
                (formattedCallDate >= formattedStartDate &&
                  formattedCallDate <= formattedEndDate) ||
                callDetail.disposition === disposition ||
                callDetail.hotel_name === hotel_name
              ) {
                const guest_data = await guest_booking_collections.findOne({
                  guest_id: callDetail.guest_id,
                });
                const agent_model = await employee_model.findOne({
                  agent_id: callDetail.agent_id,
                });

                if (guest_data || agent_model) {
                  const Full_name = `${guest_data.guest_first_name} ${guest_data.guest_last_name}`;
                  const agent_full_name = `${agent_model.first_name} ${agent_model.last_name}`;
                  const guest_details = {
                    guest_name: Full_name,
                    guest_mobile: guest_data.guest_mobile_number,
                    date: formattedCallDate,
                    agent_name: agent_full_name,
                    disposition: callDetail.disposition,
                    hotel_name: callDetail.hotel_name,
                    guest_email: guest_data.guest_email,
                    remark: callDetail.remark,
                  };
                  guestDetailsArray.push(guest_details);
                }
              }
            }
          }
        }

        await processCalls();

        if (guestDetailsArray.length === 0) {
          return res.status(404).json({ msg: "Data not found" });
        }

        return res.status(200).json({ guest_details: guestDetailsArray });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// agent summary

module.exports.get_agent_summary = async (req, res) => {
  try {
    const callsWithGuestDetails = await CallDetails.find({});

    if (callsWithGuestDetails.length === 0) {
      return res.status(404).json({ msg: `No ${type_of_call} calls found` });
    }

    const agentSummaries = {};
    let totalCount = 0;

    for (const callDetail of callsWithGuestDetails) {
      for (const call of callDetail.calls_details) {
        const agent_data = await employee_model.findOne({
          employee_id: call.employee_id,
        });
        const guestDetails = await guest_booking_collections.findOne({
          guest_id: call.guest_id,
        });

        if (agent_data) {
          totalCount++;
          const agent_full_name = `${agent_data.first_name} ${agent_data.last_name}`;
          const guest_full_name = `${guestDetails.guest_first_name} ${guestDetails.guest_last_name}`;

          if (!agentSummaries[agent_data.employee_id]) {
            // Create a new agent_summary object if it doesn't exist
            agentSummaries[agent_data.employee_id] = {
              agent_id: agent_data.agent_id,
              agent_login_time: agent_data.log_in_time,
              agent_logout_time: agent_data.log_out_time,
              employee_id: agent_data.employee_id,
              agent_name: agent_full_name,
              agent_email: agent_data.email,
              mobile: agent_data.mobile_number,
              call_details: [], // Initialize an empty array for call_details
            };
          }

          // Create a clean call object without additional metadata
          const cleanCall = {
            guest_id: call.guest_id,
            employee_id: call.employee_id,
            employee_status: call.employee_status,
            call_date: call.call_date,
            start_time: call.start_time,
            disposition: call.disposition,
            end_time: call.end_time,
            hotel_name: call.hotel_name,
            time_to_answer: call.time_to_answer,
            remark: call.remark,
            talktime: call.talktime,
            caller_id: call.caller_id,
            type: call.type,
            last_support_by: call.last_support_by,
            hang_up_by: call.hang_up_by,
            guest_status: call.guest_status,
            comments: call.comments,
            _id: call._id,
            last_called: call.last_called,
            dial_status: call.dial_status,
            guest_full_name: guest_full_name, // Add guest_first_name
            guest_mobile_number: guestDetails
              ? guestDetails.guest_mobile_number
              : " ",
            guest_location: guestDetails ? guestDetails.guest_location : " ",
          };

          // Push the clean call object to the call_details array
          agentSummaries[agent_data.employee_id].call_details.push(cleanCall);
        }
      }
    }

    // Convert the agentSummaries object into an array of agent_summary objects
    const agentSummaryArray = Object.values(agentSummaries);

    console.log(agentSummaryArray);
    return res.status(200).json({ agentSummaryArray, totalCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
