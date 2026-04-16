import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: string;
  sensei_name: string;
  dojo_name: string;
  location: string;
  quote: string;
  is_active: boolean;
  display_order: number;
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    sensei_name: '',
    dojo_name: '',
    location: '',
    quote: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  function openForm(testimonial?: Testimonial) {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        sensei_name: testimonial.sensei_name,
        dojo_name: testimonial.dojo_name,
        location: testimonial.location,
        quote: testimonial.quote,
        is_active: testimonial.is_active,
        display_order: testimonial.display_order,
      });
    } else {
      setEditingTestimonial(null);
      const maxOrder = Math.max(0, ...testimonials.map(t => t.display_order));
      setFormData({
        sensei_name: '',
        dojo_name: '',
        location: '',
        quote: '',
        is_active: true,
        display_order: maxOrder + 1,
      });
    }
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTestimonial(null);
  }

  async function saveTestimonial() {
    if (!formData.sensei_name.trim() || !formData.quote.trim()) {
      alert('Sensei name and quote are required');
      return;
    }

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (error) throw error;
      }

      closeForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial. Please try again.');
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    }
  }

  async function moveTestimonial(id: string, direction: 'up' | 'down') {
    const currentIndex = testimonials.findIndex(t => t.id === id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === testimonials.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const current = testimonials[currentIndex];
    const swap = testimonials[swapIndex];

    try {
      await supabase
        .from('testimonials')
        .update({ display_order: swap.display_order })
        .eq('id', current.id);

      await supabase
        .from('testimonials')
        .update({ display_order: current.display_order })
        .eq('id', swap.id);

      fetchTestimonials();
    } catch (error) {
      console.error('Error reordering testimonials:', error);
      alert('Failed to reorder testimonials. Please try again.');
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      alert('Failed to update testimonial. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Testimonials</h2>
        <button
          onClick={() => openForm()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">No testimonials yet</p>
          <button
            onClick={() => openForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                !testimonial.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {testimonial.sensei_name}
                      </h3>
                      {!testimonial.is_active && (
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">{testimonial.dojo_name}</p>
                    <p className="text-sm text-slate-500">{testimonial.location}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveTestimonial(testimonial.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      onClick={() => moveTestimonial(testimonial.id, 'down')}
                      disabled={index === testimonials.length - 1}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown size={20} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-slate-700 italic">"{testimonial.quote}"</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      testimonial.is_active
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {testimonial.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => openForm(testimonial)}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sensei Name *
                </label>
                <input
                  type="text"
                  value={formData.sensei_name}
                  onChange={(e) => setFormData({ ...formData, sensei_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sensei John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dojo Name
                </label>
                <input
                  type="text"
                  value={formData.dojo_name}
                  onChange={(e) => setFormData({ ...formData, dojo_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tokyo Judo Academy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tokyo, Japan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quote *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Their testimonial about the movement..."
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-slate-700">
                  Show on website
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeForm}
                className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTestimonial}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}