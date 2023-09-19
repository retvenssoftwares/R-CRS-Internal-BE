const CallDetails = require("../../models/call_details"); // Import the Mongoose model
const moment = require("moment");

// Define a route to get the total calls for a specific day
module.exports.get_all_calls = async (req, res) => {
  try {
    const { date } = req.params; // Get the date from the query parameters

    const formattedDate = date.replace(/\//g, "-");

    // Validate the date format or perform any necessary validation

    // Query the database to find calls for the specified date
    const callsForDate = await CallDetails.find({
      "calls_details.call_date": formattedDate,
    });

    let totalCalls = 0;

    // Iterate through each document and count the calls
    callsForDate.forEach((doc) => {
      console.log("calls_details");
      totalCalls += doc.calls_details.length;
    });

    res.json({ totalCalls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Define a route to get the total calls for a specific day
//const CallDetails = require('../../models/call_details'); // Import the Mongoose model

// Define a route to find the disposition with the highest occurrence for each day
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

///  get all call

module.exports.get_calls = async (req, res) => {
  try {
    let totalInboundCalls = 0;
    let totalOutboundCalls = 0;
    let totalCalls = 0;

    const allCalls = await CallDetails.find({});

    allCalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.type === "inbound") {
          totalInboundCalls++;
        } else if (callDetail.type === "outbound") {
          totalOutboundCalls++;
        }
      });

      totalCalls += call.calls_details.length;
    });

    return res.status(200).json({
      totalCalls,
      totalInboundCalls,
      totalOutboundCalls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// inbound and outbounds calls

module.exports.get_inbound_calls_and_outbounds_callDetails = async (req, res) => {
  try {
    const inboundsCalls = [];
    
    const inboundscalls = await CallDetails.find({});
    
    inboundscalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.type === "inbound") {
          inboundsCalls.push(callDetail);
        }
      });
    });


    const outboundCalls = [];
    
    const callDetails = await CallDetails.find({});
    
    callDetails.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.type === "outbound") {
          outboundCalls.push(callDetail);
        }
      });
    });

    return res.status(200).json({ inboundsCalls,outboundCalls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



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

// get total call in a week

module.exports.total_calls_in_week = async (req, res) => {
  try {
    // Parse the input date from the query parameter (assuming the date is in 'DD-MM-YYYY' format)
    const inputDate = req.query.inputDate;
    const momentInputDate = moment(inputDate, 'DD-MM-YYYY'); // Parse the input date with the correct format

    // Subtract 7 days from the input date to calculate the formattedEndDate
    const momentFormattedEndDate = momentInputDate.clone().subtract(7, 'days');

    // Format the input date and formattedEndDate back to 'DD-MM-YYYY' format
    const formattedInputDate = momentInputDate.format('DD-MM-YYYY');
    const formattedEndDate = momentFormattedEndDate.format('DD-MM-YYYY');

    // Find call details within the date range and filter out records outside the range
    const callDetails = await CallDetails.aggregate([
      {
        $unwind: '$calls_details'
      },
      {
        $match: {
          'calls_details.call_date': {
            $gte: formattedEndDate, // Greater than or equal to the formattedEndDate
            $lte: formattedInputDate, // Less than or equal to the formattedInputDate
          }
        }
      }
    ]);

    const totalRecords = callDetails.length;

    return res.status(200).json({ totalRecords });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


