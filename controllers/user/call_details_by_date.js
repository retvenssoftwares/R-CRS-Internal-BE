const CallDetails = require("../../models/call_details"); // Import the Mongoose model
const moment = require("moment");
const { format } = require('date-fns');


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
    const formattedDate = format(currentDate, 'dd-MM-yyyy');

    console.log(formattedDate)

    // Get the start of the month in "YYYY-MM-DD" format
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // 
    
    const formattedStartOfMonth = format(startOfMonth, 'dd-MM-yyyy');
    console.log(formattedStartOfMonth)
   

    allCalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.type === "inbound") {
          // Convert the call_date to a Date object
          const callDate = new Date(callDetail.call_date);
          
          // Check if the call date is within the current month
          if (callDate >= formattedStartOfMonth && callDate <= formattedDate) {
            console.log("1")
            totalInboundCallsThisMonth++;
          }
        } else if (callDetail.type === "outbound") {
          totalOutboundCalls++;
        }

        // Check if the call date matches today's date
       
      });

      totalCalls += call.calls_details.length;
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
    const momentInputDate = moment(inputDate, 'DD-MM-YYYY'); // Parse the input date with the correct format

    const results = [];

    // Loop through each day within the last 7 days
    for (let i = 0; i < 7; i++) {
      const startDate = momentInputDate.clone().subtract(i, 'days').startOf('day').format('DD-MM-YYYY');
      const endDate = momentInputDate.clone().subtract(i, 'days').endOf('day').format('DD-MM-YYYY');

      // Aggregate to count calls within the date range
      const dispositionCounts = await CallDetails.aggregate([
        {
          $unwind: '$calls_details'
        },
        {
          $match: {
            'calls_details.call_date': {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: '$calls_details.disposition',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 } // Sort by count in descending order
        },
        {
          $limit: 1 // Limit to the top disposition
        }
      ]);

      // Get the highest disposition name and count
      const highestDisposition = dispositionCounts.length > 0 ? {
        disposition: dispositionCounts[0]._id,
        count: dispositionCounts[0].count
      } : { disposition: '', count: 0 };

      // Aggregate to count total calls within the date range
      const callCount = await CallDetails.aggregate([
        {
          $unwind: '$calls_details'
        },
        {
          $match: {
            'calls_details.call_date': {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $count: 'total'
        }
      ]);

      const totalRecords = callCount.length > 0 ? callCount[0].total : 0;
      
      results.push({ date: startDate, totalRecords, highestDisposition });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
