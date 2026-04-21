import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, X, LogIn, LogOut, Youtube, Clock, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, MessageSquare, CheckSquare, Square, Download, BarChart3, CreditCard as Edit2, Trash2, Save, Users, Upload, Plus, ArrowUp, ArrowDown, Quote, Star, MapPin, Eye, EyeOff, Music, Globe, ExternalLink, Copy } from 'lucide-react';
import { TestimonialsManager } from './TestimonialsManager';
import MusicManager from './MusicManager';

interface Submission {
  id: string;
  dojo_id: string | null;
  country: string;
  email: string;
  youtube_url: string;
  level: number;
  participant_names: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at: string | null;
  admin_notes: string | null;
  dojo?: {
    name: string;
    city: string;
    province_state: string;
    country: string;
    instructor_name: string;
    email: string;
  } | null;
}

interface Analytics {
  totalSubmissions: number;
  pending: number;
  approved: number;
  rejected: number;
  byLevel: Record<number, number>;
  byCountry: Record<string, number>;
}

interface Founder {
  id: string;
  name: string;
  title: string;
  country: string;
  city: string;
  photo_url: string;
  bio: string;
  contribution_type: string;
  order_index: number;
  created_at: string;
}

interface FeaturedDojo {
  id: string;
  name: string;
  country: string;
  city: string;
  participants: number;
  image_url: string;
  description: string;
  video_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState('');
  const [deletingSubmission, setDeletingSubmission] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'submissions' | 'founders' | 'testimonials' | 'featured' | 'journey' | 'music' | 'settings'>('submissions');
  const [founders, setFounders] = useState<Founder[]>([]);
  const [showFounderForm, setShowFounderForm] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [founderFormData, setFounderFormData] = useState({
    name: '',
    title: '',
    country: '',
    city: '',
    bio: '',
    contribution_type: '',
    order_index: 0,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [featuredDojos, setFeaturedDojos] = useState<FeaturedDojo[]>([]);
  const [showFeaturedForm, setShowFeaturedForm] = useState(false);
  const [editingFeatured, setEditingFeatured] = useState<FeaturedDojo | null>(null);
  const [featuredFormData, setFeaturedFormData] = useState({
    name: '',
    country: '',
    city: '',
    participants: 0,
    image_url: '',
    description: '',
    video_url: '',
    order_index: 0,
    is_active: true,
  });

  const [journeyContent, setJourneyContent] = useState({
    id: '',
    title: '',
    content: '',
  });
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeySaving, setJourneySaving] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchFounders();
      fetchFeaturedDojos();
      fetchJourneyContent();
    }
  }, [isAuthenticated, filter, searchQuery, currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsAuthenticated(false);
      return;
    }
    const isAdmin = session.user?.app_metadata?.is_admin === true;
    setIsAuthenticated(isAdmin);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const isAdmin = data.user?.app_metadata?.is_admin === true;
      if (!isAdmin) {
        await supabase.auth.signOut();
        setLoginError('Access denied. Admin privileges required.');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('submissions')
        .select(`
          *,
          dojo:dojos (
            name,
            city,
            province_state,
            country,
            instructor_name,
            email
          )
        `, { count: 'exact' })
        .order('submitted_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      if (searchQuery) {
        query = query.or(`country.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,participant_names.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;
      setSubmissions(data as any);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: allData } = await supabase
        .from('submissions')
        .select('status, level, country');

      if (!allData) return;

      const stats: Analytics = {
        totalSubmissions: allData.length,
        pending: allData.filter(s => s.status === 'pending').length,
        approved: allData.filter(s => s.status === 'approved').length,
        rejected: allData.filter(s => s.status === 'rejected').length,
        byLevel: {},
        byCountry: {},
      };

      allData.forEach(s => {
        stats.byLevel[s.level] = (stats.byLevel[s.level] || 0) + 1;
        stats.byCountry[s.country] = (stats.byCountry[s.country] || 0) + 1;
      });

      setAnalytics(stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const toggleVideo = (videoId: string) => {
    const newSet = new Set(expandedVideos);
    if (newSet.has(videoId)) {
      newSet.delete(videoId);
    } else {
      newSet.add(videoId);
    }
    setExpandedVideos(newSet);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map(s => s.id)));
    }
  };

  const startEditingNotes = (submissionId: string, currentNotes: string | null) => {
    setEditingNotes(submissionId);
    setNotesText(currentNotes || '');
  };

  const saveNotes = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ admin_notes: notesText || null })
        .eq('id', submissionId);

      if (error) throw error;
      setEditingNotes(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    email?: string,
    country?: string,
    level?: number
  ) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', submissionId);

      if (error) throw error;

      if (email && country && level) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-submission-status`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ email, status, country, level }),
            }
          );
        } catch (emailError) {
          console.error('Error sending notification:', emailError);
        }
      }

      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const bulkUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (selectedIds.size === 0) return;

    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('submissions')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .in('id', ids);

      if (error) throw error;

      for (const id of ids) {
        const submission = submissions.find(s => s.id === id);
        if (submission) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-submission-status`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                  email: submission.email || submission.dojo?.email,
                  status,
                  country: submission.country || submission.dojo?.country,
                  level: submission.level
                }),
              }
            );
          } catch (emailError) {
            console.error('Error sending notification:', emailError);
          }
        }
      }

      setSelectedIds(new Set());
      fetchSubmissions();
    } catch (error) {
      console.error('Error bulk updating submissions:', error);
    }
  };

  const exportToCSV = async () => {
    try {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!data) return;

      const csv = [
        ['ID', 'Country', 'Email', 'Level', 'Status', 'Participant Names', 'YouTube URL', 'Submitted At', 'Approved At', 'Message', 'Admin Notes'].join(','),
        ...data.map(row => [
          row.id,
          row.country,
          row.email,
          row.level,
          row.status,
          row.participant_names || '',
          row.youtube_url,
          row.submitted_at,
          row.approved_at || '',
          row.message || '',
          row.admin_notes || ''
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const startEditingSubmission = (submissionId: string, currentUrl: string) => {
    setEditingSubmission(submissionId);
    setEditedUrl(currentUrl);
  };

  const saveEditedSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ youtube_url: editedUrl })
        .eq('id', submissionId);

      if (error) throw error;
      setEditingSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Failed to update submission. Please try again.');
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;
      setDeletingSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission. Please try again.');
    }
  };

  const fetchFounders = async () => {
    try {
      const { data, error } = await supabase
        .from('founders')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFounders(data || []);
    } catch (error) {
      console.error('Error fetching founders:', error);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;

    setUploadingPhoto(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('founder-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('founder-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openFounderForm = (founder?: Founder) => {
    if (founder) {
      setEditingFounder(founder);
      setFounderFormData({
        name: founder.name,
        title: founder.title,
        country: founder.country,
        city: founder.city,
        bio: founder.bio,
        contribution_type: founder.contribution_type,
        order_index: founder.order_index,
      });
      setPhotoPreview(founder.photo_url);
    } else {
      setEditingFounder(null);
      const maxOrder = Math.max(0, ...founders.map(f => f.order_index));
      setFounderFormData({
        name: '',
        title: '',
        country: '',
        city: '',
        bio: '',
        contribution_type: '',
        order_index: maxOrder + 1,
      });
      setPhotoPreview('');
    }
    setPhotoFile(null);
    setShowFounderForm(true);
  };

  const closeFounderForm = () => {
    setShowFounderForm(false);
    setEditingFounder(null);
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const saveFounder = async () => {
    if (!founderFormData.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      let photoUrl = editingFounder?.photo_url || '';

      if (photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }

      const founderData = {
        ...founderFormData,
        photo_url: photoUrl,
      };

      if (editingFounder) {
        const { error } = await supabase
          .from('founders')
          .update(founderData)
          .eq('id', editingFounder.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('founders')
          .insert([founderData]);

        if (error) throw error;
      }

      closeFounderForm();
      fetchFounders();
    } catch (error) {
      console.error('Error saving founder:', error);
      alert('Failed to save founder. Please try again.');
    }
  };

  const deleteFounder = async (founderId: string, photoUrl: string) => {
    if (!confirm('Are you sure you want to delete this founder?')) return;

    try {
      const { error } = await supabase
        .from('founders')
        .delete()
        .eq('id', founderId);

      if (error) throw error;

      if (photoUrl) {
        const fileName = photoUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('founder-photos')
            .remove([fileName]);
        }
      }

      fetchFounders();
    } catch (error) {
      console.error('Error deleting founder:', error);
      alert('Failed to delete founder. Please try again.');
    }
  };

  const moveFounder = async (founderId: string, direction: 'up' | 'down') => {
    const currentIndex = founders.findIndex(f => f.id === founderId);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === founders.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const current = founders[currentIndex];
    const swap = founders[swapIndex];

    try {
      await supabase
        .from('founders')
        .update({ order_index: swap.order_index })
        .eq('id', current.id);

      await supabase
        .from('founders')
        .update({ order_index: current.order_index })
        .eq('id', swap.id);

      fetchFounders();
    } catch (error) {
      console.error('Error reordering founders:', error);
      alert('Failed to reorder founders. Please try again.');
    }
  };

  const fetchFeaturedDojos = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_dojos')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFeaturedDojos(data || []);
    } catch (error) {
      console.error('Error fetching featured dojos:', error);
    }
  };

  const openFeaturedForm = (featured?: FeaturedDojo) => {
    if (featured) {
      setEditingFeatured(featured);
      setFeaturedFormData({
        name: featured.name,
        country: featured.country,
        city: featured.city,
        participants: featured.participants,
        image_url: featured.image_url,
        description: featured.description,
        video_url: featured.video_url || '',
        order_index: featured.order_index,
        is_active: featured.is_active,
      });
    } else {
      setEditingFeatured(null);
      const maxOrder = Math.max(0, ...featuredDojos.map(f => f.order_index));
      setFeaturedFormData({
        name: '',
        country: '',
        city: '',
        participants: 0,
        image_url: '',
        description: '',
        video_url: '',
        order_index: maxOrder + 1,
        is_active: true,
      });
    }
    setShowFeaturedForm(true);
  };

  const closeFeaturedForm = () => {
    setShowFeaturedForm(false);
    setEditingFeatured(null);
  };

  const saveFeaturedDojo = async () => {
    if (!featuredFormData.name.trim() || !featuredFormData.country.trim() || !featuredFormData.city.trim()) {
      alert('Name, country, and city are required');
      return;
    }

    try {
      const dojoData = {
        ...featuredFormData,
        updated_at: new Date().toISOString(),
      };

      if (editingFeatured) {
        const { error } = await supabase
          .from('featured_dojos')
          .update(dojoData)
          .eq('id', editingFeatured.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('featured_dojos')
          .insert([dojoData]);

        if (error) throw error;
      }

      closeFeaturedForm();
      fetchFeaturedDojos();
    } catch (error) {
      console.error('Error saving featured dojo:', error);
      alert('Failed to save featured dojo. Please try again.');
    }
  };

  const deleteFeaturedDojo = async (dojoId: string) => {
    if (!confirm('Are you sure you want to delete this featured dojo?')) return;

    try {
      const { error } = await supabase
        .from('featured_dojos')
        .delete()
        .eq('id', dojoId);

      if (error) throw error;
      fetchFeaturedDojos();
    } catch (error) {
      console.error('Error deleting featured dojo:', error);
      alert('Failed to delete featured dojo. Please try again.');
    }
  };

  const moveFeaturedDojo = async (dojoId: string, direction: 'up' | 'down') => {
    const currentIndex = featuredDojos.findIndex(f => f.id === dojoId);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === featuredDojos.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const current = featuredDojos[currentIndex];
    const swap = featuredDojos[swapIndex];

    try {
      await supabase
        .from('featured_dojos')
        .update({ order_index: swap.order_index })
        .eq('id', current.id);

      await supabase
        .from('featured_dojos')
        .update({ order_index: current.order_index })
        .eq('id', swap.id);

      fetchFeaturedDojos();
    } catch (error) {
      console.error('Error reordering featured dojos:', error);
      alert('Failed to reorder featured dojos. Please try again.');
    }
  };

  const toggleFeaturedActive = async (dojoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('featured_dojos')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', dojoId);

      if (error) throw error;
      fetchFeaturedDojos();
    } catch (error) {
      console.error('Error toggling featured dojo status:', error);
      alert('Failed to update featured dojo status. Please try again.');
    }
  };

  const fetchJourneyContent = async () => {
    setJourneyLoading(true);
    try {
      const { data, error } = await supabase
        .from('our_journey_content')
        .select('*')
        .eq('section_key', 'main_story')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setJourneyContent({
          id: data.id,
          title: data.title,
          content: data.content,
        });
      }
    } catch (error) {
      console.error('Error fetching journey content:', error);
    } finally {
      setJourneyLoading(false);
    }
  };

  const saveJourneyContent = async () => {
    if (!journeyContent.title.trim() || !journeyContent.content.trim()) {
      alert('Title and content are required');
      return;
    }

    setJourneySaving(true);
    try {
      const { error } = await supabase
        .from('our_journey_content')
        .update({
          title: journeyContent.title,
          content: journeyContent.content,
          updated_at: new Date().toISOString(),
        })
        .eq('section_key', 'main_story');

      if (error) throw error;
      alert('Journey content saved successfully!');
      fetchJourneyContent();
    } catch (error) {
      console.error('Error saving journey content:', error);
      alert('Failed to save journey content. Please try again.');
    } finally {
      setJourneySaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <LogIn className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-600">Access the submission dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-osp-dark to-osp-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-slate-300">Manage submissions and founders</p>
            </div>
            <div className="flex items-center space-x-3">
              {activeTab === 'submissions' && (
                <>
                  <button
                    onClick={() => {
                      setShowAnalytics(!showAnalytics);
                      if (!showAnalytics) fetchAnalytics();
                    }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    <BarChart3 size={20} />
                    <span>Analytics</span>
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download size={20} />
                    <span>Export CSV</span>
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Youtube size={20} />
              <span>Submissions</span>
            </button>
            <button
              onClick={() => setActiveTab('founders')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'founders'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users size={20} />
              <span>Founders</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'testimonials'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Quote size={20} />
              <span>Testimonials</span>
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'featured'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Star size={20} />
              <span>Featured Dojos</span>
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'journey'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Edit2 size={20} />
              <span>Our Journey</span>
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'music'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Music size={20} />
              <span>Music</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Globe size={20} />
              <span>Website Settings</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'submissions' && showAnalytics && analytics && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-slate-900">{analytics.totalSubmissions}</div>
                <div className="text-sm text-slate-600">Total Submissions</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-700">{analytics.pending}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-700">{analytics.approved}</div>
                <div className="text-sm text-green-600">Approved</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-700">{analytics.rejected}</div>
                <div className="text-sm text-red-600">Rejected</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">By Level</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.byLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center bg-slate-50 rounded px-3 py-2">
                      <span className="text-slate-700">Level {level}</span>
                      <span className="font-semibold text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Top Countries</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.byCountry)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center bg-slate-50 rounded px-3 py-2">
                        <span className="text-slate-700">{country}</span>
                        <span className="font-semibold text-slate-900">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by country, email, or participants..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              <Clock size={18} />
              <span>Pending</span>
            </button>
            <button
              onClick={() => {
                setFilter('approved');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <CheckCircle size={18} />
              <span>Approved</span>
            </button>
            <button
              onClick={() => {
                setFilter('rejected');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <XCircle size={18} />
              <span>Rejected</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing {submissions.length} of {totalCount} submissions
            </p>
            {selectedIds.size > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-600">{selectedIds.size} selected</span>
                <button
                  onClick={() => bulkUpdateStatus('approved')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => bulkUpdateStatus('rejected')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                >
                  Reject Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-600 text-lg">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filter === 'pending' && submissions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center space-x-2 text-slate-700 hover:text-slate-900"
                >
                  {selectedIds.size === submissions.length ? (
                    <CheckSquare size={20} className="text-blue-600" />
                  ) : (
                    <Square size={20} />
                  )}
                  <span className="font-semibold">
                    {selectedIds.size === submissions.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
              </div>
            )}

            {submissions.map((submission) => {
              const videoId = extractYouTubeId(submission.youtube_url);
              const country = submission.country || submission.dojo?.country || 'Unknown';
              const email = submission.email || submission.dojo?.email || 'No email';
              const isSelected = selectedIds.has(submission.id);

              return (
                <div
                  key={submission.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-3">
                        {submission.status === 'pending' && (
                          <button
                            onClick={() => toggleSelection(submission.id)}
                            className="mt-1"
                          >
                            {isSelected ? (
                              <CheckSquare size={24} className="text-blue-600" />
                            ) : (
                              <Square size={24} className="text-slate-400" />
                            )}
                          </button>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">
                            {submission.dojo?.name || 'Video Submission'}
                          </h3>
                          <p className="text-slate-600">{country}</p>
                          <p className="text-sm text-slate-500 mt-1">Contact: {email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            submission.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : submission.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Level {submission.level}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        {videoId && (
                          <div className="mb-4">
                            <button
                              onClick={() => toggleVideo(submission.id)}
                              className="relative aspect-video rounded-lg overflow-hidden w-full group"
                            >
                              <img
                                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                alt={`${submission.dojo?.name || country} - Level ${submission.level}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                <div className="bg-red-600 text-white rounded-full p-4">
                                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            </button>
                          </div>
                        )}
                        <a
                          href={submission.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center space-x-1"
                        >
                          <Youtube size={16} />
                          <span>Open in YouTube</span>
                        </a>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-end space-x-2 mb-4">
                          <button
                            onClick={() => startEditingSubmission(submission.id, submission.youtube_url)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Edit2 size={14} />
                            <span>Edit URL</span>
                          </button>
                          <button
                            onClick={() => setDeletingSubmission(submission.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700 mb-1">
                            Submitted:
                          </p>
                          <p className="text-slate-600">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </p>
                        </div>

                        {submission.participant_names && (
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                              Participants:
                            </p>
                            <p className="text-slate-600">{submission.participant_names}</p>
                          </div>
                        )}

                        {submission.message && (
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                              Message:
                            </p>
                            <p className="text-slate-600 italic">"{submission.message}"</p>
                          </div>
                        )}

                        {submission.status === 'pending' && (
                          <div className="flex space-x-3 pt-4">
                            <button
                              onClick={() => updateSubmissionStatus(
                                submission.id,
                                'approved',
                                email,
                                country,
                                submission.level
                              )}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                            >
                              <Check size={20} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => updateSubmissionStatus(
                                submission.id,
                                'rejected',
                                email,
                                country,
                                submission.level
                              )}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                            >
                              <X size={20} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {submission.approved_at && (
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">
                              {submission.status === 'approved' ? 'Approved' : 'Reviewed'}:
                            </p>
                            <p className="text-slate-600">
                              {new Date(submission.approved_at).toLocaleString()}
                            </p>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-700">Admin Notes:</p>
                            {editingNotes === submission.id ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => saveNotes(submission.id)}
                                  className="text-green-600 hover:text-green-700 text-sm font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingNotes(null)}
                                  className="text-slate-600 hover:text-slate-700 text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditingNotes(submission.id, submission.admin_notes)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1"
                              >
                                <MessageSquare size={14} />
                                <span>Edit</span>
                              </button>
                            )}
                          </div>
                          {editingNotes === submission.id ? (
                            <textarea
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              placeholder="Add internal notes about this submission..."
                            />
                          ) : (
                            <p className="text-sm text-slate-600 italic">
                              {submission.admin_notes || 'No notes yet'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editingSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Edit YouTube URL</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={editedUrl}
                  onChange={(e) => setEditedUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEditedSubmission(editingSubmission)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Delete Submission</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSubmission(deletingSubmission)}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {expandedVideos.size > 0 && submissions.map(submission => {
          if (!expandedVideos.has(submission.id)) return null;
          const videoId = extractYouTubeId(submission.youtube_url);
          if (!videoId) return null;

          return (
            <div
              key={`video-modal-${submission.id}`}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
              onClick={() => toggleVideo(submission.id)}
            >
              <div
                className="relative w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleVideo(submission.id)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X size={32} />
                </button>
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      )}

      {activeTab === 'founders' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Manage Founders</h2>
            <button
              onClick={() => openFounderForm()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              <span>Add Founder</span>
            </button>
          </div>

          {founders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">No founders yet</p>
              <button
                onClick={() => openFounderForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add Your First Founder
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {founders.map((founder, index) => (
                <div key={founder.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        {founder.photo_url ? (
                          <img
                            src={founder.photo_url}
                            alt={founder.name}
                            className="w-32 h-32 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-lg bg-slate-200 flex items-center justify-center">
                            <Users className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{founder.name}</h3>
                            {founder.title && (
                              <p className="text-slate-600 font-medium">{founder.title}</p>
                            )}
                            {(founder.city || founder.country) && (
                              <p className="text-sm text-slate-500 mt-1">
                                {founder.city && founder.country
                                  ? `${founder.city}, ${founder.country}`
                                  : founder.city || founder.country}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveFounder(founder.id, 'up')}
                              disabled={index === 0}
                              className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp size={20} />
                            </button>
                            <button
                              onClick={() => moveFounder(founder.id, 'down')}
                              disabled={index === founders.length - 1}
                              className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown size={20} />
                            </button>
                          </div>
                        </div>

                        {founder.contribution_type && (
                          <div className="inline-flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                            {founder.contribution_type}
                          </div>
                        )}

                        {founder.bio && (
                          <p className="text-slate-600 mb-4">{founder.bio}</p>
                        )}

                        <div className="flex space-x-3">
                          <button
                            onClick={() => openFounderForm(founder)}
                            className="flex items-center space-x-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteFounder(founder.id, founder.photo_url)}
                            className="flex items-center space-x-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showFounderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingFounder ? 'Edit Founder' : 'Add New Founder'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Photo
                </label>
                <div className="flex items-center space-x-4">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">Max file size: 5MB</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={founderFormData.name}
                  onChange={(e) =>
                    setFounderFormData({ ...founderFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title/Rank
                </label>
                <input
                  type="text"
                  value={founderFormData.title}
                  onChange={(e) =>
                    setFounderFormData({ ...founderFormData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sensei, 5th Dan Black Belt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={founderFormData.city}
                    onChange={(e) =>
                      setFounderFormData({ ...founderFormData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={founderFormData.country}
                    onChange={(e) =>
                      setFounderFormData({ ...founderFormData, country: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contribution Type
                </label>
                <input
                  type="text"
                  value={founderFormData.contribution_type}
                  onChange={(e) =>
                    setFounderFormData({
                      ...founderFormData,
                      contribution_type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Early Adopter, International Ambassador"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={founderFormData.bio}
                  onChange={(e) =>
                    setFounderFormData({ ...founderFormData, bio: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell their story and contribution..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeFounderForm}
                disabled={uploadingPhoto}
                className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveFounder}
                disabled={uploadingPhoto}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testimonials' && <TestimonialsManager />}

      {activeTab === 'featured' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Manage Featured Dojos</h2>
            <button
              onClick={() => openFeaturedForm()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              <span>Add Featured Dojo</span>
            </button>
          </div>

          {featuredDojos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">No featured dojos yet</p>
              <button
                onClick={() => openFeaturedForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add Your First Featured Dojo
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {featuredDojos.map((dojo, index) => (
                <div key={dojo.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${!dojo.is_active ? 'opacity-60' : ''}`}>
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        {dojo.image_url ? (
                          <img
                            src={dojo.image_url}
                            alt={dojo.name}
                            className="w-48 h-32 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-48 h-32 rounded-lg bg-slate-200 flex items-center justify-center">
                            <Star className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">{dojo.name}</h3>
                              {dojo.is_active ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Active
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <MapPin size={16} className="text-red-600" />
                                <span>{dojo.city}, {dojo.country}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users size={16} className="text-blue-600" />
                                <span>{dojo.participants} participants</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveFeaturedDojo(dojo.id, 'up')}
                              disabled={index === 0}
                              className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp size={20} />
                            </button>
                            <button
                              onClick={() => moveFeaturedDojo(dojo.id, 'down')}
                              disabled={index === featuredDojos.length - 1}
                              className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown size={20} />
                            </button>
                          </div>
                        </div>

                        {dojo.description && (
                          <p className="text-slate-600 mb-4">{dojo.description}</p>
                        )}

                        {dojo.video_url && (
                          <a
                            href={dojo.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center space-x-1 mb-4"
                          >
                            <Youtube size={16} />
                            <span>View Video</span>
                          </a>
                        )}

                        <div className="flex space-x-3">
                          <button
                            onClick={() => toggleFeaturedActive(dojo.id, dojo.is_active)}
                            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              dojo.is_active
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                          >
                            {dojo.is_active ? (
                              <>
                                <EyeOff size={16} />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Eye size={16} />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => openFeaturedForm(dojo)}
                            className="flex items-center space-x-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteFeaturedDojo(dojo.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showFeaturedForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingFeatured ? 'Edit Featured Dojo' : 'Add New Featured Dojo'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dojo Name *
                </label>
                <input
                  type="text"
                  value={featuredFormData.name}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rising Sun Judo Club"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={featuredFormData.city}
                    onChange={(e) =>
                      setFeaturedFormData({ ...featuredFormData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={featuredFormData.country}
                    onChange={(e) =>
                      setFeaturedFormData({ ...featuredFormData, country: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Participants
                </label>
                <input
                  type="number"
                  value={featuredFormData.participants}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, participants: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={featuredFormData.image_url}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, image_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://images.pexels.com/..."
                  required
                />
                <p className="text-xs text-slate-500 mt-2">Use a valid image URL from Pexels or similar</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={featuredFormData.video_url}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, video_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={featuredFormData.description}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe what makes this dojo special..."
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={featuredFormData.is_active}
                  onChange={(e) =>
                    setFeaturedFormData({ ...featuredFormData, is_active: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">
                  Active (visible on homepage)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeFeaturedForm}
                className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveFeaturedDojo}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'music' && (
        <MusicManager />
      )}

      {activeTab === 'journey' && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Edit Our Journey Content</h2>
              <p className="text-slate-600">Update the story of how this challenge began</p>
            </div>

            {journeyLoading ? (
              <div className="p-12 text-center">
                <p className="text-slate-600">Loading...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={journeyContent.title}
                    onChange={(e) => setJourneyContent({ ...journeyContent, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Our Journey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Content
                    <span className="text-slate-500 font-normal ml-2">(separate paragraphs with double line breaks)</span>
                  </label>
                  <textarea
                    value={journeyContent.content}
                    onChange={(e) => setJourneyContent({ ...journeyContent, content: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={20}
                    placeholder="Write the journey story here. Use double line breaks to separate paragraphs."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={saveJourneyContent}
                    disabled={journeySaving}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {journeySaving ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Website Settings</h2>
              <p className="text-slate-600">Configure your custom domain and deployment settings</p>
            </div>

            <div className="p-6 space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Globe className="text-blue-600 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Current Deployment</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Bolt Development URL</p>
                          <a
                            href="https://triple-waza-judo-vid-7qdg.bolt.host/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                          >
                            <span>triple-waza-judo-vid-7qdg.bolt.host</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('https://triple-waza-judo-vid-7qdg.bolt.host/');
                          }}
                          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Copy size={16} />
                          <span className="text-sm">Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Globe className="text-green-600 mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Your Custom Domain</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Production Domain</p>
                          <a
                            href="https://triplewazachallenge.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 flex items-center space-x-1 font-semibold"
                          >
                            <span>triplewazachallenge.com</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('https://triplewazachallenge.com/');
                          }}
                          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Copy size={16} />
                          <span className="text-sm">Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Deployment Options</h3>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Option 1: Netlify Deployment</h4>
                        <p className="text-sm text-slate-600">Recommended for production use with custom domain</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Recommended</span>
                    </div>

                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Step 1: Deploy to Netlify</p>
                          <p className="text-slate-600">Connect your GitHub repo or drag-and-drop the dist folder</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Step 2: Configure DNS</p>
                          <p className="text-slate-600">Add CNAME record: www → [your-site].netlify.app</p>
                          <p className="text-slate-600">Add A record: @ → 75.2.60.5</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Step 3: Add Domain in Netlify</p>
                          <p className="text-slate-600">Enter triplewazachallenge.com in domain settings</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://app.netlify.com/drop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-4"
                    >
                      <ExternalLink size={16} />
                      <span>Deploy to Netlify</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="font-bold text-slate-900 mb-1">Option 2: Cloudflare Pages</h4>
                      <p className="text-sm text-slate-600">Best if you use Cloudflare for DNS</p>
                    </div>

                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Step 1: Create Cloudflare Pages project</p>
                          <p className="text-slate-600">Connect GitHub or upload dist folder</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Step 2: Add custom domain</p>
                          <p className="text-slate-600">DNS auto-configures if using Cloudflare nameservers</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://dash.cloudflare.com/?to=/:account/pages"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-4"
                    >
                      <ExternalLink size={16} />
                      <span>Deploy to Cloudflare</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="font-bold text-slate-900 mb-1">Option 3: Direct Domain Connection</h4>
                      <p className="text-sm text-slate-600">Point your domain directly to this Bolt deployment</p>
                    </div>

                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="text-slate-600 mt-0.5 flex-shrink-0" size={16} />
                        <div>
                          <p className="font-semibold">Add CNAME record at your registrar</p>
                          <div className="bg-white rounded border border-slate-300 p-3 mt-2 font-mono text-xs">
                            <div>Type: CNAME</div>
                            <div>Name: www</div>
                            <div>Value: triple-waza-judo-vid-7qdg.bolt.host</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> This keeps the site on Bolt's infrastructure. For production use, Netlify or Cloudflare is recommended.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Project Download</h3>
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Download Project ZIP</h4>
                      <p className="text-sm text-slate-600">Download the full project source files as a ZIP archive for backup or deployment.</p>
                    </div>
                  </div>
                  <a
                    href="/triplewazachallenge-export.zip"
                    download="triplewazachallenge-export.zip"
                    className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-4"
                  >
                    <Download size={16} />
                    <span>Download Project ZIP</span>
                  </a>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://docs.netlify.com/domains-https/custom-domains/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">Netlify Domain Guide</span>
                    <ExternalLink className="text-slate-600" size={16} />
                  </a>
                  <a
                    href="https://developers.cloudflare.com/pages/configuration/custom-domains/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">Cloudflare Pages Guide</span>
                    <ExternalLink className="text-slate-600" size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
