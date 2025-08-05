import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db'; // your db connector
import Task from '@/models/Task'; // your Task model
import User from '@/models/User'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create a new task
export async function POST(request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, status, isImportant, category } = await request.json();

    // Validation (optional but recommended)
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 });
    }

    // Find the creator's User ID
    const user = await User.findOne({ username: session.user.name });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = await Task.create({
      creator: user._id,
      title: title.trim(),
      description: description.trim(),
      status: status || 'Pending',
      isImportant: !!isImportant,
      category: category || 'General',
    });

    return NextResponse.json({ message: 'Task created', task }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// export async function GET(request) {
//   try {
//     await connectToDatabase();
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const statusFilter = searchParams.get('status'); // e.g. "Pending" or "Done"

//     const query = {};
//     // Add status filter only if it exists and is valid
//     if (statusFilter && ['Pending', 'Done'].includes(statusFilter)) {
//       query.status = statusFilter;
//     }

//     // Optional: fetch all tasks regardless of creator or restrict by creator
//     // Here, fetching all tasks as per your previous request

//     const total = await Task.countDocuments(query);
    // const tasks = await Task.find(query)
    //   .populate('creator', 'username')
    //   .sort({ createdAt: -1 })

//     const serializedTasks = tasks.map(task => ({
//       ...task.toObject(),
//       creator: task.creator?.username || "Unknown Creator",
//     }));

//     return NextResponse.json({
//       tasks: serializedTasks
//     });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
//   }
// }



export async function GET(request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ username: session.user.name });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const searchTerm = searchParams.get('search'); // Get the search term from the query

    const query = {};

    if (statusFilter && ['Pending', 'Done'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    // If a search term is provided, add search logic to the query
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },       // Case-insensitive search
        { description: { $regex:searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const tasksFromDB = await Task.find(query)
      .populate('creator', 'username') // Keep your populate as is
      .sort({ createdAt: -1 });

    const tasks = tasksFromDB.map(task => {
          const taskObject = task.toObject();
          // Ensure the creator is also a plain object or null
          taskObject.creator = task.creator ? { 
            _id: task.creator._id, 
            username: task.creator.username 
          } : null;
          return taskObject;
        });
    return NextResponse.json({ tasks });
    
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
